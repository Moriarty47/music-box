import { useStore } from '@/store';
import ProgressBar from '@/ui/progress';
import { mapRange } from '@/utils';

import type { Component } from 'solid-js';

declare module 'solid-js' {
  // eslint-disable-next-line ts/no-namespace
  namespace JSX {
    interface ExplicitBoolAttributes {
      open: boolean;
    }
  }
}

const Tooltip: Component = () => {
  const [store, dispatch] = useStore();

  const toggleHandler = () => {
    dispatch('TOGGLE_VOLUME_TOOLTIP');
  };

  const changeHandler = (value: number) => {
    dispatch('SET_VOLUME', value);
  };

  const volume = () => mapRange(
    store.state.volume > 1 ? 1 : store.state.volume,
    0,
    1,
    0,
    100,
  );

  return (
    <div
      id="volume-tooltip"
      class="fixed left-[calc(var(--left)+var(--l))] top-0 flex w-28 rounded-xxl bg-default/40 px-3 py-1 text-foreground shadow-offset backdrop-blur-md backdrop-saturate-150 transition-[opacity,transform,background] duration-200 [--left:-30px] md:[--left:0px]"
      bool:open={store.state.volumeOpened}
      style={{
        '--l': `${store.state.volumePosition[0]}px`,
        'top': `${store.state.volumePosition[1]}px`,
      }}
      onPointerEnter={toggleHandler}
      onPointerLeave={toggleHandler}
    >
      <ProgressBar
        id="volume-progress"
        value={volume()}
        onChange={changeHandler}
      />
    </div>
  );
};

export default Tooltip;
