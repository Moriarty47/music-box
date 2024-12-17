import { createSignal } from 'solid-js';
import { createStore } from 'solid-js/store';

import {
  $storageSet,
  cleanupBlobUrl,
  errorLogger,
} from '@/utils';

import {
  getPlayMode,
  openDirHandler,
  PlayModeKey,
} from './handlers';

import type {
  Dispatch,
  GlobalStore,
  InfoColors,
  InfoType,
} from './types';

export enum PlayMode {
  ORDER,
  REPEAT,
  SHUFFLE,
}

const PlayModeCount = Object.keys(PlayMode).filter(key => Number.isNaN(Number(key))).length;

const [state, setState] = createStore<GlobalStore>({
  volumeOpened: false,
  running: false,
  playMode: getPlayMode(),
  duration: '00:00',
  currentTime: '00:00',
});

const [songs, setSongs] = createSignal<InfoType[]>([]);
const [song, setSong] = createSignal<InfoType>({
  title: 'By Moriarty47',
  artist: 'Music Box',
  album: 'Powered by SolidJS & Rsbuild',
} as InfoType);

const dispatch: Dispatch = (type, payload) => {
  switch (type) {
    case 'TOGGLE_VOLUME_TOOLTIP': {
      setState('volumeOpened', !state.volumeOpened);
      break;
    }
    case 'OPEN_DIR': {
      openDirHandler(songs())
        .then(setSongs)
        .catch(errorLogger);
      break;
    }
    case 'SET_SONG': {
      cleanupBlobUrl(song());
      payload && setSong(payload as InfoType);
      break;
    }
    case 'SET_COLORS': {
      const colors = payload as InfoColors;
      setState('colors', colors);
      song().colors = colors;
      break;
    }
    case 'SET_TIME': {
      setState('currentTime', payload as string);
      break;
    }
    case 'SET_DURATION': {
      setState('duration', payload as string);
      break;
    }
    case 'TOGGLE_PLAY_STATE': {
      setState('running', !state.running);
      break;
    }
    case 'CHANGE_PLAY_MODE': {
      const mode = (state.playMode + 1) % PlayModeCount;
      setState('playMode', mode);
      $storageSet(PlayModeKey, String(mode));
      break;
    }
    default: break;
  }
};

export const useStore = (): [{
  song: typeof song;
  songs: typeof songs;
  state: typeof state;
}, Dispatch] => [{
  song,
  songs,
  state,
}, dispatch];
