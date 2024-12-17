import {
  type Component,
  createSignal,
  splitProps,
} from 'solid-js';
import { Dynamic } from 'solid-js/web';

import * as Icons from '@/ui/icons/button-icons';

export type ButtonType =
  | 'OPEN_DIR'
  | 'PLAY_MODE'
  | 'PREVIOUS'
  | 'PLAY'
  | 'NEXT'
  | 'LYRICS'
  | 'MUTED';

export interface ButtonProps {
  type: ButtonType;
  ref?: HTMLButtonElement | ((el: HTMLButtonElement) => void) | undefined;
  onClick?: [(type: ButtonType, e: PointerEvent) => void, ButtonType];
  onPointerEnter?: [(type: ButtonType, e: PointerEvent) => void, ButtonType];
  onPointerLeave?: [(type: ButtonType, e: PointerEvent) => void, ButtonType];
}

const RippleButton: Component<ButtonProps> = (props) => {
  const [active, setActive] = createSignal(false);
  const [local, otherProps] = splitProps(props, ['type', 'onClick']);

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

  return (
    <button
      class="ripple-button relative z-0 inline-flex size-10 min-w-10 items-center justify-center overflow-hidden rounded-full border-0 bg-transparent text-sm font-normal text-white"
      classList={{ 'size-auto': local.type === 'PLAY', 'active': active() }}
      data-type={local.type}
      {...otherProps}
      onPointerDown={pointerDownHandler}
      onPointerUp={pointerUpHandler}
      onPointerOut={pointerOutHandler}
    >
      <Dynamic component={Icons[local.type]} />
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
