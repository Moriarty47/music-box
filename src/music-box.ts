import { Info, InfoType } from '@/info';
import { Progress } from '@/progress';
import { Controls } from '@/controls';

export class MusicBox {
  list: InfoType[];
  audio: HTMLAudioElement;
  info: InstanceType<typeof Info>;
  progress: InstanceType<typeof Progress>;
  controls: InstanceType<typeof Controls>;

  constructor(list: InfoType[] = []) {
    this.list = list;
    this.audio = this.initAudio();
    this.info = new Info(this);
    this.progress = new Progress(this);
    this.controls = new Controls(this);

    this.init();
  }

  initAudio() {
    const audio = new Audio();
    audio.volume = 0.5;
    audio.autoplay = false;
    audio.addEventListener('error', console.error);
    return audio;
  }

  init() {
    this.controls.changeMusic(0);
  }
}
