import '@/play-progress';
import { Info } from '@/info';
import { Lyrics } from '@/lyrics';
import { Volume } from '@/volume';
import { MusicBox } from '@/music-box';
import { PlayMode } from '@/play-mode';
import { IKeyboard } from '@/keyboard-manager';
import { Play2PauseAnimation } from '@/animation';
import { $, debounce, $storageSet } from '@/utils';
import type { PlayProgress } from '@/play-progress';

type MethodName = {
  [K in keyof Controls]:
  Controls[K] extends (...args: any[]) => any
  ? K extends `action_${string}` ? K : never
  : never
}[keyof Controls];

declare global {
  interface HTMLAudioElement {
    playing: boolean;
  }
}

enum PLAY_STATE {
  PAUSED,
  PLAYING,
}

export class Controls {
  index: number = 0;
  listLength: number;
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
    this.listLength = this.musicBox.list.length;
    this.info = new Info(musicBox);
    this.progressBar = $<PlayProgress>('#song-progress')!.init(musicBox);
    this.keyboard = new IKeyboard(this);
    this.volume = new Volume(this);

    this.canPlay = this.canPlay.bind(this);

    this.#saveVolume = debounce((volume: number) => {
      $storageSet('volume', String(volume));
    }, 500);

    this.initListener();
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

  changeMusic(index: number) {
    setTimeout(() => {
      const src = this.musicBox.list[index].src;
      if (src === this.audio.src) {
        this.audio.currentTime = 0;
      } else {
        this.audio.src = src;
        this.info.updateInfo();
        if (this.lyrics.visible) {
          this.lyrics.display(this.info.currentInfo.lrc);
        }
      }
      this.audio.removeEventListener('canplay', this.canPlay);
      this.audio.addEventListener('canplay', this.canPlay);
    }, 150);
  }

  canPlay() {
    this.shouldPlay();
  }

  action_PLAY_MODE() {
    this.playMode.switch();
  }

  action_PLAY() {
    this.playState = this.isPaused() ? PLAY_STATE.PLAYING : PLAY_STATE.PAUSED;
    this.play2PauseAnimation.switch();
    this.play();
  }

  /** check if paused manually */
  shouldPlay() {
    if (this.isPaused()) return;
    this.play();
  }

  play() {
    this.audio.paused ? this.audio.play() : this.audio.pause();
  }

  action_PREVIOUS() {
    this.audio.pause();
    this.index = this.playMode.getIndex('PREV', this.index, this.listLength);
    this.changeMusic(this.index);
  }

  action_NEXT() {
    this.audio.pause();
    this.index = this.playMode.getIndex('NEXT', this.index, this.listLength);
    this.changeMusic(this.index);
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

    await this.lyrics.display(this.info.currentInfo.lrc);
    this.lyrics.highlightLine(this.audio.currentTime);
  }

  isPaused() {
    return this.playState === PLAY_STATE.PAUSED;
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

function getButtonElement(e: PointerEvent): [string, HTMLButtonElement] | [null, null] {
  const button = e.target as HTMLButtonElement;
  if (button?.tagName !== 'BUTTON') return [null, null];
  const type = button.dataset.type as string;
  return [type, button];
}
