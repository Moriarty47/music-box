import '@/play-progress';
import { Info, InfoType } from '@/info';
import { Lyrics } from '@/lyrics';
import { Volume } from '@/volume';
import { MusicBox } from '@/music-box';
import { PlayMode } from '@/play-mode';
import { IKeyboard } from '@/keyboard-manager';
import { Play2PauseAnimation } from '@/animation';
import { $, debounce, getFilename, getTargetElement, getButtonElement, $storageSet, getFileRecursively, getMediaInfo, errorLogger, isAudioType, normalizeFile, cleanupBlobUrl, deferred } from '@/utils';
import type { PlayProgress } from '@/play-progress';

type MethodName = {
  [K in keyof Controls]:
  Controls[K] extends (...args: any[]) => any
  ? K extends `action_${string}` ? K : never
  : never
}[keyof Controls];

enum PLAY_STATE {
  PAUSED,
  PLAYING,
}

export class Controls {
  index: number = 0;
  /** paused manually state */
  playState: PLAY_STATE = PLAY_STATE.PAUSED;
  audio: HTMLAudioElement;
  info: Info;
  musicBox: MusicBox;
  keyboard: IKeyboard;
  volume: Volume;
  progressBar: PlayProgress;
  controls = $<HTMLDivElement>('.controls-wrapper')!;
  playMode = new PlayMode();
  play2PauseAnimation = new Play2PauseAnimation($('#play-path')!);
  lyrics = new Lyrics();
  #saveVolume: (volume: number) => void;

  constructor(musicBox: MusicBox) {
    this.musicBox = musicBox;
    this.audio = musicBox.audio;
    this.info = new Info(musicBox);
    this.progressBar = $<PlayProgress>('#song-progress')!.init(musicBox);
    this.keyboard = new IKeyboard(this);
    this.volume = new Volume(this);

    this.canPlay = this.canPlay.bind(this);
    this.handleListClick = this.handleListClick.bind(this);

    this.#saveVolume = debounce((volume: number) => {
      $storageSet('volume', String(volume));
    }, 500);

    this.initListener();
  }

  get listLength() {
    return this.musicBox.list.length;
  }

  isPlayState(state: PLAY_STATE) {
    return this.playState === state;
  }

  setPlayState(state: PLAY_STATE) {
    this.playState = state;
  }

  initListener() {
    this.initAudioListener();
    this.initButtonListener();
  }

  initAudioListener() {

    const updateHandler = () => {
      if (this.progressBar.isSeeking) return;
      this.info.setCurrentTime(this.audio.currentTime);
      this.progressBar.updateProgress();
      this.lyrics.highlightLine(this.audio.currentTime);
    };

    const loadMetadataHandler = () => {
      this.audio.addEventListener('timeupdate', updateHandler);
      this.info.setDuration(this.audio.duration);
      this.progressBar.updateProgress();
    };

    const endedHandler = () => {
      this.audio.removeEventListener('timeupdate', updateHandler);
      this.action_NEXT();
    };

    this.audio.addEventListener('loadedmetadata', loadMetadataHandler, false);
    this.audio.addEventListener('ended', endedHandler, false);
  }

  initButtonListener() {
    this.controls.addEventListener('pointerdown', (e) => {
      e.preventDefault();
      const [type, button] = getButtonElement(e);
      if (!type) return;
      button.classList.add('active');

      this.controls.addEventListener('pointerout', () => {
        button.classList.remove('active');
      }, { once: true });
    });

    this.controls.addEventListener('pointerup', (e) => {
      const [type, button] = getButtonElement(e);
      if (!type) return;
      button.classList.remove('active');

      this[`action_${type}` as MethodName]?.();

      this.addRipple(e, button);
    });
  }

  async action_OPEN_DIR() {
    if (!window.showDirectoryPicker) {
      errorLogger('Not supported yet. Please use Chrome > 86 or Edge > 86 instead.');
      return;
    }
    try {
      const dirHandle = await window.showDirectoryPicker();
      await this.addSongList(dirHandle);
    } catch { }
  }

  async changeMusic() {
    cleanupBlobUrl(this.audio, this.info.currentInfo);

    const item = this.musicBox.list[this.index];
    const file = item.file;

    if (file) {
      item.src = URL.createObjectURL(file);
      const { tags = {} } = await getMediaInfo(file) || {};
      this.musicBox.list[this.index] = {
        ...item,
        title: tags.title || item.title,
        album: tags.album || item.album,
        cover: tags.picture || item.cover,
        artist: tags.artist || item.artist,
      } as InfoType;
    }

    const dfd = deferred();

    setTimeout(() => {
      const src = item.src;
      if (src === this.audio.src) {
        this.audio.currentTime = 0;
      } else {
        this.audio.src = src || '';
        this.info.updateInfo();
        if (this.lyrics.visible) {
          this.info.currentInfo.lrc = normalizeFile(this.info.currentInfo, 'lrc');
          this.lyrics.display(this.info.currentInfo.lrc);
        }
      }
      this.audio.addEventListener('canplay', () => {
        dfd.resolve(this.audio);
        this.action_PLAY();
      }, { once: true });
    }, 150);

    return dfd.promise;
  }

  /** check if paused manually */
  canPlay() {
    if (this.isPaused()) return;
    this.play();
  }

  action_PLAY_MODE() {
    this.playMode.switch();
  }

  isResourceEmpty() {
    return this.audio.src === location.href;
  }

  action_PLAY() {
    if (this.isResourceEmpty()) return;
    this.setPlayState(this.isPaused() ? PLAY_STATE.PLAYING : PLAY_STATE.PAUSED);
    this.play2PauseAnimation.switch();
    this.play();
  }

  play() {
    this.audio.paused
      ? this.audio.play().catch(errorLogger)
      : this.audio.pause();
  }

  action_PREVIOUS() {
    if (this.isResourceEmpty()) return;
    this.audio.pause();
    this.index = this.playMode.getIndex('PREV', this.index, this.listLength);
    this.changeMusic();
  }

  action_NEXT() {
    if (this.isResourceEmpty()) return;
    this.audio.pause();
    this.index = this.playMode.getIndex('NEXT', this.index, this.listLength);
    this.changeMusic();
  }

  action_MUTED() {
    this.audio.muted = !this.audio.muted;
  }

  setVolume(volume: number) {
    this.audio.volume = volume;
    this.#saveVolume(volume);
  }

  action_VOLUME_UP() {
    const volume = (this.audio.volume * 100 + 10) / 100;
    if (volume > 1) this.setVolume(1);
    else this.setVolume(volume);
  }

  action_VOLUME_DOWN() {
    const volume = (this.audio.volume * 100 - 10) / 100;
    if (volume < 0) this.setVolume(0);
    else this.setVolume(volume);
  }

  async action_LYRICS() {
    const musicBox = $('.music-box')!;
    musicBox.classList.toggle('open-lyrics');

    this.lyrics.visible = !this.lyrics.visible;

    await this.lyrics.display(normalizeFile(this.info.currentInfo, 'lrc'));
    this.lyrics.highlightLine(this.audio.currentTime);
  }

  isPaused() {
    return this.isPlayState(PLAY_STATE.PAUSED);
  }

  async addSongList(dirHandle: FileSystemDirectoryHandle) {
    const list = this.musicBox.list;
    const listWrapper = $<HTMLDivElement>('.list-wrapper')!;
    listWrapper.classList.add('list');

    const listUl = listWrapper.querySelector('ul')!;
    const listFrags = document.createDocumentFragment();
    let i = list.length;
    const extraFiles = [];
    for await (const file of getFileRecursively(dirHandle)) {
      if (!isAudioType(file)) {
        extraFiles.push(file);
        continue;
      }
      const li = document.createElement('li');
      const filename = getFilename(file);
      li.textContent = filename.name;
      li.dataset.index = `${i++}`;
      listFrags.appendChild(li);
      list.push({ title: filename.name, file } as InfoType);
    }
    this.addExtraInfo(extraFiles);

    listUl.replaceChildren(listFrags);

    listUl.addEventListener('pointerdown', this.handleListClick);
  }

  handleListClick(e: PointerEvent) {
    const ele = getTargetElement<HTMLLIElement>(e, 'LI');
    if (!ele) return;

    let index = ele.dataset.index;
    if (index === undefined || index === null) return;
    this.index = Number(index);

    this.changeMusic();
  }

  addExtraInfo(extraFiles: File[]) {
    extraFiles.forEach(file => {
      const filename = getFilename(file);
      const songItem = this.musicBox.list.find(item => item.title === filename.name);
      if (!songItem) return;

      if (filename.ext === 'lrc' || filename.ext === 'txt') {
        songItem.lrcObject = file;
      } else {
        songItem.coverObject = file;
      }
    });
  }

  addRipple(e: PointerEvent, btn: HTMLButtonElement) {
    const { clientX, clientY } = e;
    const rect = btn.getBoundingClientRect();
    const offsetX = clientX - (rect.left + rect.width / 2);
    const offsetY = clientY - (rect.top + rect.height / 2);

    const ripple = document.createElement('span');
    ripple.classList.add('ripple');
    ripple.style.setProperty('width', `${rect.width}px`);
    ripple.style.setProperty('height', `${rect.height}px`);
    ripple.style.setProperty('inset', `${offsetY}px 0 0 ${offsetX}px`);
    btn.appendChild(ripple);

    setTimeout(() => {
      ripple.remove();
    }, 400);
  }
}
