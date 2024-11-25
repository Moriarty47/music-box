import { $ } from 'virtual:$global';
import { Play2PauseAnimation } from '@/animation';
import { MusicBox } from '@/music-box';
import { PlayMode } from '@/play-mode';

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
  index: number;
  listLength: number;
  /** paused manually state */
  playState: PLAY_STATE = PLAY_STATE.PAUSED;
  audio: HTMLAudioElement;
  controls: HTMLDivElement;
  musicBox: InstanceType<typeof MusicBox>;
  playMode: InstanceType<typeof PlayMode>;
  play2PauseAnimation: InstanceType<typeof Play2PauseAnimation>;

  constructor(musicBox: InstanceType<typeof MusicBox>) {
    this.musicBox = musicBox;
    this.audio = musicBox.audio;
    this.index = 0;
    this.listLength = this.musicBox.list.length;
    this.controls = $('.controls-wrapper')!;
    this.play2PauseAnimation = new Play2PauseAnimation($('#play-path')!);

    this.playMode = new PlayMode();
    this.canPlay = this.canPlay.bind(this);

    this.initListener();
  }

  initListener() {
    this.initAudioListener();
    this.initButtonListener();

  }

  initAudioListener() {
    const { info, progress } = this.musicBox;

    const updateHandler = () => {
      if (progress.isSeeking) return;
      info.setCurrentTime(this.audio.currentTime);
      progress.updateProgress();
    };

    this.audio.addEventListener('loadedmetadata', () => {
      this.audio.addEventListener('timeupdate', updateHandler);
      info.setDuration(this.audio.duration);
      progress.updateProgress();
    });
    this.audio.addEventListener('ended', () => {
      this.audio.removeEventListener('timeupdate', updateHandler);
      this.action_NEXT();
    });
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
        this.musicBox.info.updateInfo();
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

  action_LYRICS() {
    console.log('LYRICS');
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
