import { onMount } from 'solid-js';

import { useStore } from '@/store';

import type { Component } from 'solid-js';

import type { GlobalStore } from '@/store';
import type { Dispatch } from '@/store/types';

const IKeyboardKey = {
  SPACE: 'Space',
  LEFT: 'ArrowLeft',
  RIGHT: 'ArrowRight',
  UP: 'ArrowUp',
  DOWN: 'ArrowDown',
  SLASH: 'Slash',
  KEY_F: 'KeyF',
  KEY_M: 'KeyM',
  Equal: 'Equal',
  Minus: 'Minus',
  NumpadAdd: 'NumpadAdd',
  NumpadSubtract: 'NumpadSubtract',

} as const;

class IKeyboard {
  keys: { [key: string]: boolean } = {};
  constructor(public store: GlobalStore, public dispatch: Dispatch) {
    this.onKeydown = this.onKeydown.bind(this);
    this.listen();
  }

  onKeydown(event: KeyboardEvent) {
    switch (event.code) {
      case IKeyboardKey.SPACE:
        event.preventDefault();
        this.dispatch('PLAY');
        break;
      case IKeyboardKey.UP:
        event.preventDefault();
        this.dispatch('VOLUME_UP');
        break;
      case IKeyboardKey.DOWN:
        event.preventDefault();
        this.dispatch('VOLUME_DOWN');
        break;
      case IKeyboardKey.KEY_F:
        event.preventDefault();
        this.dispatch('TOGGLE_FULLSCREEN');
        break;
      case IKeyboardKey.KEY_M:
        event.preventDefault();
        event.ctrlKey ?
            this.dispatch('PLAY_MODE') :
            this.dispatch('MUTED');
        break;
      case IKeyboardKey.SLASH:
        event.preventDefault();
        this.dispatch('LYRICS');
        break;
      case IKeyboardKey.LEFT:
        event.preventDefault();
        event.ctrlKey ?
            this.dispatch('PREV') :
            this.dispatch('BACKWARD');
        break;
      case IKeyboardKey.RIGHT:
        event.preventDefault();
        event.ctrlKey ?
            this.dispatch('NEXT') :
            this.dispatch('FORWARD');
        break;
      case IKeyboardKey.Equal:
      case IKeyboardKey.Minus:
      case IKeyboardKey.NumpadAdd:
      case IKeyboardKey.NumpadSubtract:
        event.preventDefault();
        break;
      default:
        break;
    }
  }

  listen() {
    const onWheel = (e: WheelEvent) => {
      e.ctrlKey && e.preventDefault();
    };
    window.addEventListener('wheel', onWheel, { passive: false });
    window.addEventListener('keydown', this.onKeydown);
    return () => {
      window.removeEventListener('wheel', onWheel);
      window.removeEventListener('keydown', this.onKeydown);
    };
  }
}

const Keyboard: Component = () => {
  const [store, dispatch] = useStore();

  onMount(() => {
    new IKeyboard(store, dispatch).listen();
  });

  return null;
};

export default Keyboard;
