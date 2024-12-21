import { Howl, Howler } from 'howler';
import { batch } from 'solid-js';

import { errorLogger } from '@/utils';

import type {
  Dispatch,
  GlobalState,
  InfoType,
} from './types';

// https://github.com/goldfire/howler.js/issues/1642#issuecomment-1480144511
Howler.autoUnlock = false;

let rafId: number | null = null;

export const createAudio = (song: InfoType, store: GlobalState, dispatch: Dispatch) => {
  let player: Howl | null = null;

  const raf = () => {
    // https://github.com/goldfire/howler.js/issues/1177#issuecomment-1211697869
    nextLoop(() => rafId = requestAnimationFrame(step));
  };

  const caf = () => {
    rafId && cancelAnimationFrame(rafId);
    rafId = null;
  };

  caf();

  function step() {
    if (!player) return;
    if (store.seeking) {
      caf();
      return;
    }

    const time = player.seek() || 0;
    batch(() => {
      dispatch('SET_DISPLAY_TIME', time);
      dispatch('SET_CURRENT_TIME', time);
    });

    if (player.playing()) raf();
  };

  player = new Howl({
    src: song.src,
    // html5: true,
    preload: 'metadata',
    format: song.format || 'mp3',
    volume: store.volume,
    autoplay: store.running,
    onload: () => {
      batch(() => {
        dispatch('SET_DURATION', song.player?.duration());
        dispatch('TOGGLE_LOADING');
      });
    },
    onplay: raf,
    onseek: raf,
    onend: () => {
      dispatch('NEXT');
    },
    onloaderror: (_, error) => {
      errorLogger(error);
    },
  });

  player.load();
  return player;
};

export const playOrPause = (song: InfoType, running: boolean) => {
  nextLoop(() => running ? song.player?.play() : song.player?.pause());
};

function nextLoop(fn: () => void) {
  setTimeout(() => {
    fn();
  }, 50);
}
