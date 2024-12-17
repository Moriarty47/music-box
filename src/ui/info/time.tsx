import { useStore } from '@/store';

import type { Component } from 'solid-js';

const TimeInfo: Component = () => {
  const [store] = useStore();
  return (
    <div class="flex select-none justify-between text-sm">
      <p class="current-time">{store.state.currentTime}</p>
      <p class="duration text-foreground/50">{store.state.duration}</p>
    </div>
  );
};

export default TimeInfo;
