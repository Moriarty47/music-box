import {
  createEffect,
  createSignal,
  For,
  on,
  onMount,
} from 'solid-js';

import { Play2PauseAnimation, PlayModeAnimation } from '@/animation';
import { PlayMode, useStore } from '@/store';
import RippleButton from '@/ui/button/ripple-button';

import type { Component } from 'solid-js';

import type { ButtonType } from '@/ui/button/ripple-button';

const buttons: ButtonType[] = [
  'OPEN_DIR',
  'PLAY_MODE',
  'PREVIOUS',
  'PLAY',
  'NEXT',
  'LYRICS',
  'MUTED',
];

const ControlButtons: Component = () => {
  const [store, dispatch] = useStore();
  const [buttonRefs, setButtonRefs] = createSignal<Record<ButtonType, HTMLElement>>({} as Record<ButtonType, HTMLElement>);
  const animationRefs = {} as Record<ButtonType, Play2PauseAnimation
    | PlayModeAnimation>;

  const saveRefs = (ele: HTMLElement, type: ButtonType) => {
    if (['PLAY_MODE', 'PLAY', 'MUTED'].includes(type)) {
      setButtonRefs((prev) => {
        prev[type] = ele;
        return prev;
      });
    }
  };

  onMount(() => {
    const btns = buttonRefs();
    (Object.keys(btns) as ButtonType[]).forEach((type) => {
      if (type === 'PLAY') {
        animationRefs[type] = new Play2PauseAnimation(btns[type].querySelector('#play-path')!);
      } else if (type === 'PLAY_MODE') {
        animationRefs[type] = new PlayModeAnimation(btns[type].querySelector('#mode-path')!);
      }
    });
  });

  createEffect(on(() => store.state.running, () => {
    animationRefs.PLAY.switch();
  }, { defer: true }));

  createEffect(on(() => store.state.playMode, (curr, prev) => {
    console.log('curr, prev :>>', curr, prev);
    if (prev === undefined) {
      if (curr === PlayMode.REPEAT) {
        animationRefs.PLAY_MODE.switch();
      }
    }

    if (prev === PlayMode.SHUFFLE) return;

    animationRefs.PLAY_MODE.switch();
  }));

  const classProps = (type: ButtonType) => type === 'PLAY_MODE' ?
      {
        classList: {
          [PlayMode[store.state.playMode]]: true,
        },
      } :
      {};

  const clickHandler = (type: ButtonType) => {
    switch (type) {
      case 'PLAY': {
        dispatch('TOGGLE_PLAY_STATE');
        break;
      }
      case 'PLAY_MODE': {
        dispatch('CHANGE_PLAY_MODE');
        break;
      }
      default:
        break;
    }
  };

  const pointerEnterHandler = (type: ButtonType) => {
    if (type !== 'MUTED') return;
    dispatch('TOGGLE_VOLUME_TOOLTIP');
  };

  const pointerLeaveHandler = (type: ButtonType) => {
    if (type !== 'MUTED') return;
    dispatch('TOGGLE_VOLUME_TOOLTIP');
  };

  const eventProps = (type: ButtonType): Record<string, [(type: ButtonType, e: PointerEvent) => void, ButtonType]> => type === 'MUTED' ?
      {
        onClick: [clickHandler, type],
        onPointerEnter: [pointerEnterHandler, type],
        onPointerLeave: [pointerLeaveHandler, type],
      } :
      {
        onClick: [clickHandler, type],
      };

  return (
    <div class="controls-wrapper relative flex w-full items-center justify-center">
      <For each={buttons}>
        {button => (
          <RippleButton
            type={button}
            ref={ele => saveRefs(ele, button)}
            {...classProps(button)}
            {...eventProps(button)}
          />
        )}
      </For>
    </div>
  );
};

export default ControlButtons;
