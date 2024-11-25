import { $ } from 'virtual:$global';
import { PlayModeAnimation } from '@/animation';

export enum PLAY_MODE {
  ORDER,
  REPEAT,
  SHUFFLE,
}

const MODE_KEY = 'play_mode';
const MODE_LENGTH = Object.keys(PLAY_MODE).filter((key) => isNaN(Number(key))).length;

export class PlayMode {
  mode: PLAY_MODE;
  animation: InstanceType<typeof PlayModeAnimation>;

  constructor() {
    this.mode = PLAY_MODE.ORDER;
    this.setPlayMode(PLAY_MODE[this.mode]);
    this.animation = new PlayModeAnimation($('#repeat-path')!);
  }

  getIndex(type: 'PREV' | 'NEXT', index: number, listLength: number) {
    switch (this.mode) {
      case PLAY_MODE.ORDER:
        return type === 'PREV' ? (index - 1 + listLength) % listLength : (index + 1) % listLength;
      case PLAY_MODE.REPEAT:
        return index;
      case PLAY_MODE.SHUFFLE:
        return Math.floor(Math.random() * listLength);
      default:
        return 0;
    }
  }

  getPlayMode() {
    return Number(localStorage.getItem(MODE_KEY)) || PLAY_MODE.ORDER;
  }

  setPlayMode(...modes: string[]) {
    const ele = $('[data-type="PLAY_MODE"]')!;
    if (modes.length === 1) {
      ele.classList.add(modes[0]);
      if (modes[0] === 'REPEAT') {
        this.animation.switch();
      }
    } else {
      ele.classList.remove(modes[0]);
      ele.classList.add(modes[1]);
    }
    localStorage.setItem(MODE_KEY, String(this.mode));
  }

  switch() {
    const prevMode = PLAY_MODE[this.mode];
    this.mode = (this.mode + 1) % MODE_LENGTH;
    const currMode = PLAY_MODE[this.mode];

    this.setPlayMode(prevMode, currMode);

    if (prevMode === 'SHUFFLE') return;

    this.animation.switch();
  }

  isOrder() {
    return this.mode === PLAY_MODE.ORDER;
  }

  isRepeat() {
    return this.mode === PLAY_MODE.REPEAT;
  }

  isShuffle() {
    return this.mode === PLAY_MODE.SHUFFLE;
  }
}