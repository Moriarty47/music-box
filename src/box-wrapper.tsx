import { useStore } from '@/store';
import ControlButtons from '@/ui/button/control-buttons';
import CoverList from '@/ui/cover-list';
import SongInfo from '@/ui/info/song';
import TimeInfo from '@/ui/info/time';
import Lyrics from '@/ui/lyrics';
import SongProgress from '@/ui/progress/song-progress';

import type { Component } from 'solid-js';

const Box: Component = () => {
  const [store] = useStore();

  return (
    <div class="wrapper m-auto my-2 flex w-[50rem] items-start justify-center overflow-hidden rounded-lg px-2 py-4">
      <div
        class="music-box relative flex h-auto max-w-[38.125rem] flex-col items-center justify-center overflow-hidden rounded-xxl bg-default/50 text-foreground shadow-offset backdrop-blur-md backdrop-saturate-150 transition-[transform,background] duration-200 focus-visible:outline-none"
        classList={{ 'open-lyrics': store.state.lyricsOpened }}
        tabindex="-1"
      >
        <div class="relative flex h-auto w-full flex-auto flex-col overflow-hidden break-words p-3 text-left">
          <div class="grid grid-cols-6 items-center justify-center gap-6 md:grid-cols-12 md:gap-4">
            <div class="relative col-span-6 md:col-span-4">
              <CoverList />
            </div>

            <div class="col-span-6 flex flex-col md:col-span-8">
              <SongInfo />

              <div class="flex flex-col gap-1" style={{ 'margin-top': '0.75rem' }}>
                <div class="progress-wrapper flex w-full flex-col gap-1">
                  <SongProgress />
                  <TimeInfo />
                </div>

                <ControlButtons />
              </div>
            </div>
          </div>
          <Lyrics />
        </div>
      </div>
    </div>
  );
};

export default Box;
