import {
  createEffect,
  createSignal,
  For,
  on,
  onMount,
} from 'solid-js';

import { PlayMode, useStore } from '@/store';
import RippleButton, { ButtonType } from '@/ui/button/ripple-button';
import { Play2PauseAnimation, PlayModeAnimation } from '@/ui/icons/animation';

import type { Component } from 'solid-js';

const buttons = Object.keys(ButtonType).filter(key => key !== 'HINT') as ButtonType[];

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
      if (type === ButtonType.PLAY) {
        animationRefs[type] = new Play2PauseAnimation(btns[type].querySelector('#play-path')!);
      } else if (type === ButtonType.PLAY_MODE) {
        animationRefs[type] = new PlayModeAnimation(btns[type].querySelector('#mode-path')!);
      }
    });
  });

  createEffect(on(() => store.state.running, () => {
    animationRefs.PLAY.switch();
  }, { defer: true }));

  createEffect(on(() => store.state.playMode, (curr, prev) => {
    if (prev === undefined) {
      if (curr === PlayMode.REPEAT) animationRefs.PLAY_MODE.switch();

      return;
    }

    if (prev === PlayMode.SHUFFLE) return;

    animationRefs.PLAY_MODE.switch();
  }));

  const clickHandler = (type: ButtonType) => {
    dispatch(ButtonType[type] as any);
  };

  const pointerEnterHandler = (type: ButtonType) => {
    if (type !== ButtonType.MUTED) return;
    const { left, top } = buttonRefs().MUTED.getBoundingClientRect();
    const offsetX = left - 36;
    const offsetY = top - 15;
    dispatch('TOGGLE_VOLUME_TOOLTIP', [offsetX, offsetY]);
  };

  const pointerLeaveHandler = (type: ButtonType) => {
    if (type !== ButtonType.MUTED) return;
    dispatch('TOGGLE_VOLUME_TOOLTIP');
  };

  const volumeClassProps = () => {
    const volume = store.state.volume;
    if (volume === 0) return 'muted';
    if (volume > 0 && volume <= 0.3) return 'low';
    if (volume > 0.3 && volume <= 0.6) return 'middle';
    return 'high';
  };

  const classProps = (type: ButtonType) => {
    if (type === ButtonType.PLAY_MODE) {
      return { classList: { [PlayMode[store.state.playMode]]: true } };
    } else if (type === ButtonType.MUTED) {
      return { classList: { [volumeClassProps()]: true } };
    }
    return {};
  };

  const playBtnProps = (type: ButtonType) => {
    if (type === ButtonType.PLAY) {
      return { loading: store.state.loading };
    }
    return {};
  };

  const eventProps = (type: ButtonType): Record<string, [(type: ButtonType, e: PointerEvent) => void, ButtonType]> => type === ButtonType.MUTED ?
      {
        onClick: [clickHandler, type],
        onPointerEnter: [pointerEnterHandler, type],
        onPointerLeave: [pointerLeaveHandler, type],
      } :
      {
        onClick: [clickHandler, type],
      };

  return (
    <div class="controls-wrapper relative flex w-full items-center justify-center gap-1">
      <For each={buttons}>
        {button => (
          <RippleButton
            type={button}
            ref={ele => saveRefs(ele, button)}
            {...classProps(button)}
            {...playBtnProps(button)}
            {...eventProps(button)}
          />
        )}
      </For>
    </div>
  );
};

export default ControlButtons;
