import {
  createEffect,
  createResource,
  createSignal,
  For,
  on,
  onMount,
  Show,
} from 'solid-js';

import { useElementSize } from '@/hooks';
import { useStore } from '@/store';
import { MaximizeIcon, MinimizeIcon } from '@/ui/icons/normal';
import {
  cleanupBlobUrl,
  normalizeFile,
} from '@/utils';
import fullscreen from '@/utils/fullscreen';

import { findLyricsIndex, parseLyrics } from './lyrics';
import Wave from './wave';

import type { Component } from 'solid-js';

type UlHeights = {
  width: number;
  height: number;
  liHeight: number;
};

const Lyrics: Component = () => {
  let visible = false;

  const [store, dispatch] = useStore();
  const [lyricSrc, setLyricSrc] = createSignal<string | undefined>();
  const [offset, setOffset] = createSignal(0);

  const [lyrics] = createResource(() => lyricSrc(), (url?: string) => parseLyrics(url || 'default'));
  const [currentIndex, setCurrentIndex] = createSignal(0);
  const [heights, container, setObserver] = useElementSize<UlHeights>({
    width: 0,
    height: 0,
    liHeight: 0,
  }, (setHeights, entries) => {
    const entry = entries[0].target as HTMLElement;
    const li = entry.querySelector('li');
    setHeights({
      width: entry?.clientWidth || 574,
      height: (entry?.clientHeight || 200) - (store.state.fullscreen ? 0 : 12),
      // div > ul > li
      liHeight: li?.clientHeight || 32,
    });
  });

  createEffect(() => {
    const { height, liHeight } = heights();
    setOffset((height - liHeight) / 2 - currentIndex() * liHeight);
  });

  createEffect(on(() => [store.song().src, store.state.lyricsOpened] as [string, boolean], ([currSrc, lyricsOpened], prevState) => {
    visible = lyricsOpened;
    if (!lyricsOpened) return;
    if (!currSrc && currSrc === prevState?.[0]) {
      setLyricSrc('default');
      return;
    }
    const song = store.song();
    cleanupBlobUrl(song.lrc);
    song.lrc = normalizeFile(song, 'lrc');
    setLyricSrc(song.lrc || 'normal');
  }, { defer: true }));

  const highlightLine = (currentTime: number) => {
    const lyricsItems = lyrics();
    if (!lyricsItems || lyricsItems.length <= 1) return setCurrentIndex(0);
    setCurrentIndex(findLyricsIndex(currentTime, lyricsItems));
  };

  createEffect(on(() => store.state.currentTime, (curr) => {
    visible && highlightLine(curr);
  }, { defer: true }));

  onMount(() => {
    fullscreen.onChange(() => {
      if (!fullscreen.isFullscreen) {
        dispatch('TOGGLE_FULLSCREEN', false);
      }
    });
  });

  createEffect(on(() => store.state.fullscreen, (curr) => {
    if (!curr) {
      fullscreen.exit();
    } else {
      fullscreen.request(container());
    }
  }, { defer: true }));

  return (
    <div class="lyrics-wrapper grid grid-rows-[0fr] transition-[grid-template-rows] duration-300 ease-in">
      <div class="lyrics-list overflow-hidden">
        <div class="group relative h-[12.5rem] select-none pt-3" classList={{ fullscreen: store.state.fullscreen }} ref={setObserver}>
          <div class="z-5 absolute inset-x-0 overflow-hidden inset-y-[12px_0] group-[.fullscreen]:inset-0">
            <ul
              class="lrc-list flex flex-col items-center justify-center text-center transition-transform duration-300 ease-in"
              style={{ transform: `translateY(${offset()}px)` }}
            >
              <For each={lyrics()}>
                {(lyric, index) => (
                  <li classList={{
                    active: currentIndex() === index(),
                  }}
                  >
                    {lyric.line}
                  </li>
                )}
              </For>
            </ul>
          </div>
          <span
            class="absolute bottom-0 right-0 z-10 rounded-md p-[.1rem] hover:cursor-pointer hover:bg-foreground/10 group-[.fullscreen]:bottom-4 group-[.fullscreen]:right-4"
            title="全屏"
            onClick={() => dispatch('TOGGLE_FULLSCREEN')}
          >
            <Show when={store.state.fullscreen} fallback={<MaximizeIcon />}>
              <MinimizeIcon />
            </Show>
          </span>

          <Wave size={heights()} fullscreen={store.state.fullscreen} />
        </div>
      </div>
    </div>
  );
};

export default Lyrics;
