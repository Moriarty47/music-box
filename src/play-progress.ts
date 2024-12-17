import { ProgressBar } from '@/progress-bar';

import type { MusicBox } from '@/music-box';

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
    this.musicBox.controls.canPlay();
  }

  getCurrentCursorTime() {
    const time = this.getCurrentCursorPosition();
    if (time === 1) return this.audio.duration - 0.5;
    return time * this.audio.duration;
  }

  updateProgress() {
    const current = this.audio.currentTime;
    const duration = this.audio.duration;
    if (Number.isNaN(current) || Number.isNaN(duration)) return;
    this.setProgress(String((current / duration) * 100));
  }
}

PlayProgress.register('play-progress');
