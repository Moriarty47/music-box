import { Show } from 'solid-js';

import { useStore } from '@/store';

import type { Component } from 'solid-js';

const Audio: Component = () => {
  const [store] = useStore();

  const song = store.song;

  return (
    <Show when={song().src}>
      <audio id="music-audio" class="hidden" crossorigin="anonymous" src={song().src} />
    </Show>
  );
};

export default Audio;
