import { useStore } from '@/store';
import { HeartIcon } from '@/ui/icons/normal';

import type { Component } from 'solid-js';

const SongInfo: Component = () => {
  const [store] = useStore();

  return (
    <div class="flex cursor-default items-start justify-between">
      <div class="info-wrapper flex flex-auto flex-col overflow-hidden">
        <h3 class="text-xl font-semibold text-foreground/90">{store.song().artist || '未知'}</h3>
        <p class="text-sm text-foreground/90">{store.song().album || '未知'}</p>
        <h1
          class="mt-2 w-auto max-w-[11.875rem] truncate text-xl font-medium text-foreground md:max-w-full"
        >
          {store.song().title || '未知'}
        </h1>
      </div>
      <div class="relative inline-flex items-center justify-center text-[red]">
        <HeartIcon />
      </div>
    </div>
  );
};

export default SongInfo;
