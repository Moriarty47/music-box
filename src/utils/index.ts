import type { InfoType } from '@/store/types';

export const TAG = '\x1B[43;30m[MusicBox]\x1B[m';

export const isDev = import.meta.env.DEV;

export const NOOP = () => { };

export const $ = <T extends HTMLElement>(selectors: string, parent: Document | HTMLElement | T = document): T | null => {
  return parent.querySelector(selectors);
};

export const $storageGet = (key: string, defaultValue?: any) => localStorage.getItem(`music_box_${key}`) ?? defaultValue;

export const $storageSet = (key: string, value: string) => localStorage.setItem(`music_box_${key}`, value);

export const errorLogger = isDev ? (...errors: any) => console.error(`${TAG} `, ...errors) : NOOP;

export const getAttribute = (ele: HTMLElement, key: string): string | boolean => {
  const value = ele.getAttribute(key);
  if (value === '' || value === 'true') return true;
  if (value === 'false' || value === null) return false;
  return value;
};

export const getTargetElement = <T extends HTMLElement>(e: PointerEvent, tagName: string): T | null => {
  const ele = e.target as T;
  if (ele?.tagName !== tagName) return null;
  return ele;
};

export const getButtonElement = (e: PointerEvent): [string, HTMLButtonElement] | [null, null] => {
  const button = getTargetElement<HTMLButtonElement>(e, 'BUTTON');
  if (!button) return [null, null];
  const type = button.dataset.type as string;
  return [type, button];
};

export const isAudioType = (file: { type: string }) => {
  return file.type.startsWith('audio/');
};

export const getFilename = (file: { name: string }) => {
  let ext: string = '';
  const name = file.name.replace(/\.(\w+)$/, (_, $0) => {
    ext = $0;
    return '';
  });
  return { name, ext };
};

export const mapRange = (
  s: number,
  smin: number,
  smax: number,
  tmin: number,
  tmax: number,
): number => {
  if (smin === smax) {
    throw new Error('Invalid range: [a, b] cannot have a zero length.');
  }
  return tmin + ((s - smin) / (smax - smin)) * (tmax - tmin);
};

export const orderIndex = (type: 'PREV' | 'NEXT', index: number, listLength: number) => type === 'PREV' ? (index - 1 + listLength) % listLength : (index + 1) % listLength;

export const reorderSongList = (array: InfoType[]) => {
  const newArray = [...array];
  return newArray.sort((a, b) => a.index - b.index);
};

export const fisherYatesShuffle = <T>(array: T[]): T[] => {
  const newArray = [...array];
  for (let i = newArray.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [newArray[i], newArray[j]] = [newArray[j], newArray[i]];
  }
  return newArray;
};

export const debounce = <T>(func: (...args: T[]) => void, delay: number) => {
  let timer: number;
  return (...args: T[]) => {
    clearTimeout(timer);
    timer = window.setTimeout(() => {
      func(...args);
    }, delay);
  };
};

export async function* getFileRecursively<T extends FileSystemDirectoryHandle | FileSystemFileHandle>(entry: T): FileSystemDirectoryHandleAysncIterator<File> {
  if (entry.kind === 'file') {
    const file = await entry.getFile();
    if (file !== null) {
      yield file;
    }
  } else if (entry.kind === 'directory') {
    for await (const handle of entry.values()) {
      yield * getFileRecursively(handle as T);
    }
  }
}

export const getMediaInfo = async (file: File | Blob) => {
  if (!window.jsmediatags) {
    throw new Error('Not found jsmediatags');
  }
  return new Promise<JSMEDIA_TAG>((resolve) => {
    window.jsmediatags.read(file, {
      onSuccess: resolve,
      onError(error) {
        errorLogger(error);
        resolve({ tags: {} } as JSMEDIA_TAG);
      },
    });
  });
};

export function formatDisplayTime(time: number) {
  const m = Math.floor(time / 60);
  const s = Math.floor(time % 60);
  return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
}

export const normalizeFile = (info: InfoType, type: 'lrc' | 'cover') => {
  if (type === 'lrc' && typeof info.lrcObject === 'object') {
    return info.lrc = URL.createObjectURL(info.lrcObject);
  }
  if (type === 'cover' && typeof info.coverObject === 'object') {
    return info.cover = URL.createObjectURL(info.coverObject);
  }
  return info[type];
};

export const deleteProps = (target: object, keys: string[]) =>
  keys.forEach(key => Reflect.deleteProperty(target, key));

export const cleanupBlobUrl = (url: string) => {
  if (url && url.startsWith('blob:')) {
    URL.revokeObjectURL(url);
  }
};

export interface Deferred<T> {
  promise: Promise<T>;
  resolve: (value: T | PromiseLike<T>) => void;
  reject: (reason?: any) => void;
}

export const deferred = <T>(): Deferred<T> => {
  const dfd: Deferred<T> = {} as Deferred<T>;
  dfd.promise = new Promise<T>((rs, rj) => {
    dfd.resolve = rs;
    dfd.reject = rj;
  });
  return dfd;
};
