/* eslint-disable ts/no-use-before-define */
/* eslint-disable no-useless-return */
import {
  batch,
  createResource,
} from 'solid-js';
import { createStore } from 'solid-js/store';

import {
  $storageSet,
  cleanupBlobUrl,
  errorLogger,
  fisherYatesShuffle,
  orderIndex,
  reorderSongList,
} from '@/utils';

import { createAudio, playOrPause } from './audio';
import {
  formatInfo,
  getJsonSongs,
  getPlayMode,
  openDirHandler,
  PlayModeKey,
} from './handlers';

import type {
  Dispatch,
  GlobalState,
  InfoColors,
  InfoType,
} from './types';

export enum PlayMode {
  ORDER,
  REPEAT,
  SHUFFLE,
}

const PlayModeCount = Object.keys(PlayMode).filter(key => Number.isNaN(Number(key))).length;

const defaultSong = {
  index: -1,
  title: 'By Moriarty47',
  artist: 'Music Box',
  album: 'Powered by SolidJS & Rsbuild',
} as InfoType;

const [state, setState] = createStore<GlobalState>({
  volumeOpened: false,
  volumePosition: [-9999, -9999],
  lyricsOpened: false,
  fullscreen: false,
  loading: false,
  running: false,
  seeking: false,
  playMode: getPlayMode(),
  volume: 0.5,
  duration: 0,
  currentTime: 0,
  displayTime: 0,
  currentIndex: -1,
});

// eslint-disable-next-line solid/reactivity
let cacheVolume = state.volume;

const [songs, { mutate: setSongs }] = createResource<InfoType[]>(getJsonSongs, { initialValue: [] });
const song = () => songs()[state.currentIndex] || defaultSong;
const player = (_song: InfoType = song()) => {
  if (!_song || !_song.player) return;
  return _song.player;
};

const getPlayIndex = (type: 'PREV' | 'NEXT') => {
  const listLength = songs().length;
  if (listLength === 0) return -1;

  switch (state.playMode) {
    case PlayMode.ORDER:
    case PlayMode.SHUFFLE:
      return orderIndex(type, state.currentIndex, listLength);
    case PlayMode.REPEAT:
      return state.currentIndex;
    default:
      return -1;
  }
};

const repeatSong = () => {
  player()?.seek(0);
  state.running && player()?.play();
};

const shuffleSongs = (index: number, songs: InfoType[]) => {
  const songList = fisherYatesShuffle(songs);
  index = songList.findIndex(song => song.index === index);
  batch(() => {
    setSongs(songList);
    dispatch('SET_SONG_INDEX', { index, update: false });
  });
};

const dispatch: Dispatch = (type, payload) => {
  switch (type) {
    case 'LYRICS': { // TOGGLE LYRICS
      setState('lyricsOpened', !state.lyricsOpened);
      return;
    }
    case 'PLAY': { // TOGGLE PLAY STATE
      if (song().index === -1) return;
      setState('running', !state.running);
      playOrPause(song(), state.running);
      return;
    }
    case 'MUTED': {
      let vol = 0;
      if (state.volume === 0) {
        vol = cacheVolume;
      } else {
        vol = 0;
        cacheVolume = state.volume;
      }
      setState('volume', vol);
      player()?.volume(vol);
      return;
    }
    case 'TOGGLE_LOADING': {
      setState('loading', !state.loading);
      return;
    }
    case 'TOGGLE_SEEKING': {
      setState('seeking', !state.seeking);
      return;
    }
    case 'TOGGLE_FULLSCREEN': {
      if (!state.lyricsOpened) return;
      setState('fullscreen', (payload as boolean) ?? !state.fullscreen);
      return;
    }
    case 'TOGGLE_VOLUME_TOOLTIP': {
      if (payload) setState('volumePosition', payload as [number, number]);
      setState('volumeOpened', !state.volumeOpened);
      return;
    }
    case 'PLAY_MODE': { // CHANGE PLAY MODE
      const mode = (state.playMode + 1) % PlayModeCount;
      setState('playMode', mode);
      $storageSet(PlayModeKey, String(mode));

      const index = song().index;

      // reorder song list and keep current play index unchange
      if (mode === PlayMode.ORDER) {
        batch(() => {
          setSongs(reorderSongList(songs()));
          dispatch('SET_SONG_INDEX', { index, update: false });
        });
      } else if (mode === PlayMode.SHUFFLE) {
        shuffleSongs(index, songs());
      }
      return;
    }
    case 'OPEN_DIR': {
      openDirHandler(songs())
        // eslint-disable-next-line solid/reactivity
        .then((res) => {
          if (state.playMode === PlayMode.SHUFFLE) {
            shuffleSongs(song().index, res);
          } else {
            setSongs(res);
          }
        })
        .catch(errorLogger);
      return;
    }
    case 'PREV': {
      if (state.playMode === PlayMode.REPEAT) {
        return repeatSong();
      }
      dispatch('SET_SONG_INDEX', { index: getPlayIndex('PREV'), update: true });
      return;
    }
    case 'NEXT': {
      if (state.playMode === PlayMode.REPEAT) {
        return repeatSong();
      }
      dispatch('SET_SONG_INDEX', { index: getPlayIndex('NEXT'), update: true });
      return;
    }
    case 'FORWARD': {
      player()?.seek(state.currentTime + 10);
      return;
    }
    case 'BACKWARD': {
      player()?.seek(state.currentTime - 10);
      return;
    }
    case 'SET_SONG_INDEX': {
      const { index: newIndex, update } = payload as { index: number; update?: boolean };
      if (!update) {
        // No need to update when change play mode
        setState('currentIndex', newIndex);
        return;
      }
      if (
        state.currentIndex === newIndex ||
        newIndex < 0 ||
        newIndex >= songs().length
      ) {
        return;
      }

      const oldSong = song();
      cleanupBlobUrl(oldSong.src);
      cleanupBlobUrl(oldSong.lrc);
      player(oldSong)?.unload();
      oldSong.player = null;

      const newSong = songs()[newIndex];

      dispatch('TOGGLE_LOADING');
      formatInfo(newSong)
        .then(() => {
          setState('currentIndex', newIndex);
          newSong.player = createAudio(newSong, state, dispatch);
        });
      return;
    }
    case 'SET_COLORS': {
      const colors = payload as InfoColors;
      setState('colors', colors);
      return;
    }
    case 'SET_VOLUME': {
      setState('volume', payload as number);
      player()?.volume(payload as number);
      return;
    }
    case 'VOLUME_UP': {
      let vol = (state.volume * 100 + 10) / 100;
      if (vol > 1) vol = 1;
      dispatch('SET_VOLUME', vol);
      return;
    }
    case 'VOLUME_DOWN': {
      let vol = (state.volume * 100 - 10) / 100;
      if (vol < 0) vol = 0;
      dispatch('SET_VOLUME', vol);
      return;
    }
    case 'SET_CURRENT_TIME': {
      setState('currentTime', payload as number);
      return;
    }
    case 'SET_DISPLAY_TIME': {
      setState('displayTime', payload as number);
      return;
    }
    case 'SET_DURATION': {
      setState('duration', payload as number);
      return;
    }
    default: return;
  }
};

export type GlobalStore = {
  songs: typeof songs;
  state: typeof state;
  song: () => InfoType;
};

export const useStore = (): [GlobalStore, Dispatch] => [{
  songs,
  state,
  song,
}, dispatch];
