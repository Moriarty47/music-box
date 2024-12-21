import type { Howl } from 'howler';

import type { PlayMode } from '.';

export type InfoColors = { start: string; end: string };

export type InfoType = {
  index: number;
  title: string;
  album: string;
  artist: string;
  src: string;
  cover: string;
  lrc: string;
  coverObject?: File;
  lrcObject?: File;
  file?: File;
  format?: string;
  colors?: InfoColors;
  initMeta?: boolean;
  player?: Howl | null;
};

export type GlobalState = {
  volumeOpened: boolean;
  volumePosition: [number, number];
  lyricsOpened: boolean;
  fullscreen: boolean;
  loading: boolean;
  running: boolean;
  seeking: boolean;
  playMode: PlayMode;
  colors?: InfoColors;
  volume: number;
  duration: number;
  currentTime: number;
  displayTime: number;
  currentIndex: number;
};

type DispatchEvents = {
  OPEN_DIR: () => void;
  PLAY_MODE: () => void;
  PREV: () => void;
  PLAY: () => void;
  NEXT: () => void;
  MUTED: () => void;
  LYRICS: () => void;
  FORWARD: () => void;
  BACKWARD: () => void;
  TOGGLE_LOADING: () => void;
  TOGGLE_SEEKING: () => void;
  TOGGLE_FULLSCREEN: (payload?: boolean) => void;
  TOGGLE_VOLUME_TOOLTIP: (payload?: [number, number]) => void;
  SET_VOLUME: (payload: number) => void;
  VOLUME_UP: () => void;
  VOLUME_DOWN: () => void;
  SET_CURRENT_TIME: (payload: number) => void;
  SET_DISPLAY_TIME: (payload: number) => void;
  SET_DURATION: (payload: number) => void;
  SET_COLORS: (payload: InfoColors) => void;
  SET_SONG_INDEX: (payload: { index: number; update?: boolean }) => void;
};

type UnionToIntersection<U> = (U extends any ? (k: U) => void : never) extends (
  (k: infer I) => void) ? I : never;

type EventType = keyof DispatchEvents;

type DispatchMapped = {
  [K in EventType]: DispatchEvents[K] extends (payload: infer P) => infer R ?
      (type: K, payload?: P) => R : never;
};

export type Dispatch = UnionToIntersection<DispatchMapped[EventType]>;
