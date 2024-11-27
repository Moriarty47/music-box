import { $ } from '@/utils';

export class IAudio {
  audio: HTMLAudioElement;
  audioCtx: AudioContext;
  track: MediaElementAudioSourceNode;
  gainNode: GainNode;

  constructor() {
    this.audio = $<HTMLAudioElement>('#music-audio')!;
    this.audioCtx = new AudioContext();
    this.track = this.audioCtx.createMediaElementSource(this.audio);
    this.gainNode = this.audioCtx.createGain();
    this.track
      .connect(this.gainNode)
      .connect(this.audioCtx.destination);
    this.changeVolume(0.5);
  }

  get playing() {
    return this.audio.currentTime > 0 && !this.audio.paused && !this.audio.ended && this.audio.readyState > this.audio.HAVE_CURRENT_DATA;
  }

  get paused() {
    return this.audio.paused;
  }

  play() {
    if (this.audioCtx.state === 'suspended') {
      this.audioCtx.resume();
      return;
    }

    return this.audio.play();
  }

  pause() {
    return this.audio.pause();
  }

  changeVolume(value: number) {
    this.gainNode.gain.value = Number(value);
  }
}