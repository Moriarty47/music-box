import type { PlayMode } from '.';

export type InfoColors = { start: string; end: string };

export type InfoType = {
  title: string;
  album: string;
  artist: string;
  src: string;
  cover: string;
  lrc: string;
  coverObject?: File;
  lrcObject?: File;
  file?: File;
  colors?: InfoColors;
  initMeta?: boolean;
};

type DispatchEvents = {
  OPEN_DIR: undefined;
  PLAY_MODE: undefined;
  PREVIOUS: undefined;
  PLAY: undefined;
  NEXT: undefined;
  LYRICS: undefined;
  MUTED: undefined;
  TOGGLE_VOLUME_TOOLTIP: undefined;
  SET_TIME: string;
  SET_DURATION: string;
  SET_COLORS: InfoColors;
  SET_SONG: InfoType;
  TOGGLE_PLAY_STATE: undefined;
  CHANGE_PLAY_MODE: undefined;
};

type UnionToIntersection<U> = (U extends any ? (k: U) => void : never) extends (
  (k: infer I) => void) ? I : never;

type EventType = keyof DispatchEvents;

type DispatchMapped = {
  [K in EventType]: (type: K, payload?: DispatchEvents[K]) => void;
};

export type Dispatch = UnionToIntersection<DispatchMapped[EventType]>;

export type GlobalStore = {
  volumeOpened: boolean;
  running: boolean;
  playMode: PlayMode;
  duration: string;
  currentTime: string;
  colors?: InfoColors;
};
