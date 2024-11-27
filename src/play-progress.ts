import { MusicBox } from '@/music-box';
import { ProgressBar } from '@/progress-bar';

export class PlayProgress extends ProgressBar {
  musicBox!: MusicBox;
  audio!: HTMLAudioElement;

  constructor() {
    super();
  }

  init(musicBox: MusicBox) {
    this.musicBox = musicBox;
    this.audio = musicBox.audio;
    return this;
  }

  onDragging() {
    this.musicBox.controls.info.setCurrentTime(this.getCurrentCursorTime());
  }

  onDragEnd() {
    this.audio.currentTime = this.getCurrentCursorTime();
    this.musicBox.controls.shouldPlay();
  }

  getCurrentCursorTime() {
    const time = this.getCurrentCursorPosition();
    if (time === 1) return this.audio.duration - .5;
    return time * this.audio.duration;
  }

  updateProgress() {
    const current = this.audio.currentTime;
    const duration = this.audio.duration;
    if (isNaN(current) || isNaN(duration)) return;
    this.setProgress(String((current / duration) * 100));
  }
}

PlayProgress.register('play-progress');