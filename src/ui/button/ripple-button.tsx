import {
  type Component,
  createSignal,
  Show,
  splitProps,
} from 'solid-js';
import { Dynamic } from 'solid-js/web';

import * as Icons from '@/ui/icons/button-icons';

export enum ButtonType {
  OPEN_DIR = 'OPEN_DIR',
  PLAY_MODE = 'PLAY_MODE',
  PREV = 'PREV',
  PLAY = 'PLAY',
  NEXT = 'NEXT',
  LYRICS = 'LYRICS',
  MUTED = 'MUTED',
  HINT = 'HINT',
}

export interface ButtonProps {
  ref?: HTMLButtonElement | ((el: HTMLButtonElement) => void) | undefined;
  type: ButtonType;
  title?: string;
  sizeCls?: string;
  loading?: boolean;
  onClick?: [(type: ButtonType, e: PointerEvent) => void, ButtonType];
  onPointerEnter?: [(type: ButtonType, e: PointerEvent) => void, ButtonType];
  onPointerLeave?: [(type: ButtonType, e: PointerEvent) => void, ButtonType];
}

const RippleButton: Component<ButtonProps> = (props) => {
  const [active, setActive] = createSignal(false);
  const [local, otherProps] = splitProps(props, ['type', 'sizeCls', 'loading', 'onClick']);

  const pointerDownHandler = () => {
    setActive(true);
  };

  const pointerUpHandler = (e: PointerEvent) => {
    addRipple(e);
    setActive(false);
    local.onClick?.[0]?.(local.type, e);
  };

  const pointerOutHandler = () => {
    setActive(false);
  };

  const size = () => {
    return local.sizeCls || 'size-10 min-w-10';
  };

  return (
    <button
      class={`ripple-button relative z-0 inline-flex items-center justify-center overflow-hidden rounded-full border-0 bg-transparent text-sm font-normal text-white hover:bg-foreground/10 ${size()}`}
      classList={{
        'size-[54px]': local.type === ButtonType.PLAY,
        'active': active(),
        'cursor-default pointer-events-none': local.loading,
      }}
      data-type={local.type}
      {...otherProps}
      onPointerDown={pointerDownHandler}
      onPointerUp={pointerUpHandler}
      onPointerOut={pointerOutHandler}
    >
      <Show when={local.loading}>
        <span class="loading absolute inset-0 rounded-full bg-white" />
      </Show>
      <span classList={{
        'opacity-0': local.loading,
        'opacity-100': !local.loading,
      }}
      >
        <Dynamic component={Icons[local.type]} />
      </span>
    </button>
  );
};

export default RippleButton;

function addRipple(e: PointerEvent) {
  const btn = e.target as HTMLButtonElement;
  const { clientX, clientY } = e;
  const rect = btn.getBoundingClientRect();
  const offsetX = clientX - (rect.left + rect.width / 2);
  const offsetY = clientY - (rect.top + rect.height / 2);

  const ripple = document.createElement('span');
  ripple.classList.add('ripple');
  ripple.style.setProperty('width', `${rect.width}px`);
  ripple.style.setProperty('height', `${rect.height}px`);
  ripple.style.setProperty('inset', `${offsetY}px 0 0 ${offsetX}px`);
  btn.appendChild(ripple);

  setTimeout(() => {
    ripple.remove();
  }, 400);
};
