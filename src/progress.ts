import { $ } from 'virtual:$global';
import { MusicBox } from '@/music-box';

export class Progress {
  isSeeking: boolean = false;
  musicBox: InstanceType<typeof MusicBox>;
  audio: HTMLAudioElement;
  progressWrapper: HTMLElement;
  progress: HTMLInputElement;

  constructor(musicBox: InstanceType<typeof MusicBox>) {
    this.musicBox = musicBox;
    this.audio = musicBox.audio;
    this.progressWrapper = $('.progress-wrapper')!;
    const filler = $('.filler', this.progressWrapper)!;
    const thumb = $('.thumb', this.progressWrapper)!;
    this.progress = $<HTMLInputElement>('#progress', this.progressWrapper)!;

    const rangeInput = () => {
      filler.style.setProperty('width', `${this.progress.value}%`);
      thumb.style.setProperty('left', `${this.progress.value}%`);
    };
    this.progress.addEventListener('input', rangeInput);

    this.initListener();
  }

  initListener() {
    this.progress.addEventListener('pointerdown', () => {
      this.isSeeking = true;
      this.progressWrapper.classList.add('grabbing');

      const moveHandler = () => {
        this.isSeeking = true;
        this.setDisplayCurrentTime();
      };

      const pointerUpHandler = () => {
        this.isSeeking = false;
        this.progressWrapper.classList.remove('grabbing');
        this.setAudioCurrentTime();

        this.progress.removeEventListener('pointermove', moveHandler);
      };

      this.progress.addEventListener('pointermove', moveHandler);
      this.progress.addEventListener('pointerup', pointerUpHandler, { once: true });
    });
  }

  setDisplayCurrentTime() {
    this.musicBox.info.setCurrentTime(this.getCurrentCursorTime());
  }

  setAudioCurrentTime() {
    this.audio.currentTime = this.getCurrentCursorTime();
    this.musicBox.controls.shouldPlay();
  }

  getCurrentCursorTime() {
    return (Number(this.progress.value) / 100) * this.audio.duration;
  }

  setProgress(current: number, duration: number) {
    if (isNaN(current) || isNaN(duration)) return;
    this.progress.value = String((current / duration) * 100);
    this.progress.dispatchEvent(new Event('input'));
  }

  updateProgress() {
    this.setProgress(this.audio.currentTime, this.audio.duration);
  }
}