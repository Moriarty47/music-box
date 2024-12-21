import { For } from 'solid-js';

import { useStore } from '@/store';

import Cover from './cover';

import type { Accessor, Component } from 'solid-js';

const defaultSrc = './images/unknown.bmp';

const CoverList: Component = () => {
  const [store, dispatch] = useStore();

  const clickHandler = (index: Accessor<number>) => {
    dispatch('SET_SONG_INDEX', { index: index(), update: true });
  };

  return (
    <div
      class="list-wrapper [perspective:1000px] [&.list>div]:hover:[transform:rotateY(180deg)]"
      classList={{ list: store.songs().length > 0 }}
    >
      <div
        class="relative max-w-full select-none rounded-xxxl shadow-middle transition-all duration-500 [transform-style:preserve-3d]"
      >
        <Cover src={store.song().cover || defaultSrc} />
        <ul
          class="song-list absolute inset-0 z-20 size-full overflow-hidden overflow-y-auto rounded-inherit bg-black/80 p-2 text-xs [backface-visibility:hidden] [transform:rotateY(180deg)]"
        >
          <For each={store.songs()}>
            {(song, index) => (
              <li class="truncate" classList={{ selected: index() === store.state.currentIndex }} onClick={[clickHandler, index]}>{song.title}</li>
            )}
          </For>
        </ul>
      </div>
    </div>
  );
};

export default CoverList;
