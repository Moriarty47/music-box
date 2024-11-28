import { InfoType } from '@/info';
import { Controls } from '@/controls';
import { $, $storageGet, errorLogger } from '@/utils';

export class MusicBox {
  list: InfoType[];
  audio!: HTMLAudioElement;
  controls!: Controls;

  constructor(list: InfoType[] = []) {
    this.list = list;
    this.init();
  }

  initAudio() {
    const audio = $<HTMLAudioElement>('#music-audio')!;
    audio.volume = Number($storageGet('volume', '0.5'));
    audio.autoplay = false;
    audio.addEventListener('error', error => {
      error.message && errorLogger(error);
    });
    Object.defineProperty(audio, 'playing', {
      get: () => audio.currentTime > 0 && !audio.paused && !audio.ended && audio.readyState > audio.HAVE_CURRENT_DATA,
    });
    return audio;
  }

  init() {
    this.audio = this.initAudio();
    this.controls = new Controls(this);
    this.controls.index = 0;
    this.controls.changeMusic();
  }
}
