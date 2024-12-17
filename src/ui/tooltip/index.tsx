import ProgressBar from '@/ui/progress';

import type { Component } from 'solid-js';

const Tooltip: Component = () => {
  return (
    <div
      id="volume-tooltip"
      class="fixed left-[calc(var(--left)+var(--l))] top-0 flex w-28 rounded-xxl bg-default/40 px-3 py-1 text-foreground shadow-offset backdrop-blur-md backdrop-saturate-150 transition-[transform,background] duration-200 [--left:-30px] md:[--left:0px]"
    >
      <ProgressBar id="volume-progress" />
    </div>
  );
};

export default Tooltip;
