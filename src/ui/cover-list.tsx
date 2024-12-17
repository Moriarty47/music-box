import {
  createSignal,
  For,
  onMount,
} from 'solid-js';

import { useDomRef } from '@/hooks';
import { useStore } from '@/store';
import { getColorsFromImage } from '@/ui/info/colors';
import { getMediaInfo, normalizeFile } from '@/utils';

import type { Component } from 'solid-js';

import type { InfoType } from '@/store/types';

const defaultSrc = './images/unknown.bmp';

const CoverList: Component = () => {
  const coverRef = useDomRef<HTMLImageElement | null>(null);

  const [store, dispatch] = useStore();
  const [loaded, setLoaded] = createSignal(false);

  onMount(() => {
    const cover = coverRef.value();
    if (!cover) return;
    cover.src = defaultSrc;
  });

  const setCoverSrc = (src: string) => {
    setLoaded(false);
    const cover = coverRef.value();
    if (!cover) return;
    cover.src = src;
  };

  const formatInfo = async (song: InfoType) => {
    const file = song.file;
    if (file) {
      song.src = URL.createObjectURL(file);

      if (!song.initMeta) {
        const { tags = {} } = await getMediaInfo(file) || {};
        song.title = tags.title || song.title;
        song.album = tags.album || song.album;
        song.cover = tags.picture || song.cover;
        song.artist = tags.artist || song.artist;
        song.initMeta = true;
      }
    }

    normalizeFile(song, 'cover');
  };

  const clickHandler = async (song: InfoType) => {
    await formatInfo(song);
    dispatch('SET_SONG', song);
    setCoverSrc(song.cover || defaultSrc);
  };

  const loadHandler = () => {
    const cover = coverRef.value();
    if (!cover) return;

    setTimeout(() => {
      setLoaded(true);
      dispatch('SET_COLORS', store.song().colors || getColorsFromImage(cover));
    }, 500);
  };

  const errorHandler = () => {
    setCoverSrc(defaultSrc);
  };

  return (
    <div
      class="list-wrapper group [perspective:1000px]"
      classList={{ list: store.songs().length > 0 }}
    >
      <div
        class="relative max-w-full select-none rounded-xxl shadow-middle transition-all duration-500 [transform-style:preserve-3d] group-[.list]:hover:[transform:rotateY(180deg)]"
      >
        <img
          ref={coverRef}
          id="cover"
          alt="Album cover"
          class="relative z-10 block h-[200px] max-w-full rounded-xxl object-cover opacity-0 shadow-middle transition-opacity duration-300 ease-in [&.loaded]:opacity-100"
          classList={{ loaded: loaded() }}
          draggable="false"
          width="100%"
          height="200"
          on:load={loadHandler}
          on:error={errorHandler}
        />
        <ul
          class="song-list absolute inset-0 z-20 size-full overflow-hidden overflow-y-auto rounded-xxl bg-black/80 p-2 text-xs [backface-visibility:hidden] [transform:rotateY(180deg)]"
        >
          <For each={store.songs()}>
            {song => (
              <li class="truncate" onClick={[clickHandler, song]}>{song.title}</li>
            )}
          </For>
        </ul>
      </div>
    </div>
  );
};

export default CoverList;
