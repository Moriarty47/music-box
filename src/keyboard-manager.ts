import { Controls } from '@/controls';

export const enum IKeyboardKey {
  SPACE = 'Space',
  LEFT = 'ArrowLeft',
  LEFT2 = 'BracketLeft',
  RIGHT = 'ArrowRight',
  RIGHT2 = 'BracketRight',
  UP = 'ArrowUp',
  DOWN = 'ArrowDown',
  LYRICS = 'Slash',
  MUTED = 'KeyM',
}
export class IKeyboard {
  controls: Controls;
  keys: { [key: string]: boolean; } = {};
  constructor(controls: Controls) {
    this.controls = controls;
    this.onKeyup = this.onKeyup.bind(this);
    this.listen();
  }


  onKeyup(event: KeyboardEvent) {
    event.preventDefault();
    switch (event.code) {
      case IKeyboardKey.SPACE:
        this.controls.action_PLAY();
        break;
      case IKeyboardKey.LEFT:
        this.controls.action_PREVIOUS();
        break;
      case IKeyboardKey.LEFT2:
        event.ctrlKey && this.controls.action_PREVIOUS();
        break;
      case IKeyboardKey.RIGHT:
        this.controls.action_NEXT();
        break;
      case IKeyboardKey.RIGHT2:
        event.ctrlKey && this.controls.action_NEXT();
        break;
      case IKeyboardKey.UP:
        event.ctrlKey && this.controls.action_VOLUME_UP();
        break;
      case IKeyboardKey.DOWN:
        event.ctrlKey && this.controls.action_VOLUME_DOWN();
        break;
      case IKeyboardKey.MUTED:
        event.ctrlKey && this.controls.action_MUTED();
        break;
      case IKeyboardKey.LYRICS:
        event.ctrlKey && this.controls.action_LYRICS();
        break;
      default:
        break;
    }
  }


  listen() {
    window.addEventListener('keydown', this.onKeyup);
    return () => {
      window.removeEventListener('keydown', this.onKeyup);
    };
  }
}
