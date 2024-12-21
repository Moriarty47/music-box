import { useStore } from '@/store';
import { formatDisplayTime } from '@/utils';

import type { Component } from 'solid-js';

const TimeInfo: Component = () => {
  const [store] = useStore();
  return (
    <div class="flex select-none justify-between text-sm">
      <p class="current-time">{formatDisplayTime(store.state.displayTime)}</p>
      <p class="duration text-foreground/50">{formatDisplayTime(store.state.duration)}</p>
    </div>
  );
};

export default TimeInfo;
