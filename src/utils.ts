import { InfoType } from './info';

export function $<T extends HTMLElement>(selectors: string, parent: Document | HTMLElement | T = document): T | null {
  return parent.querySelector(selectors);
}

export function $storageGet(key: string, defaultValue?: any) {
  return localStorage.getItem(`music_box_${key}`) ?? defaultValue;
}

export function $storageSet(key: string, value: string) {
  return localStorage.setItem(`music_box_${key}`, value);
}

export function errorLogger(...errors: any) {
  console.error(...errors);
}

export function getAttribute(ele: HTMLElement, key: string): string | boolean {
  const value = ele.getAttribute(key);
  if (value === '' || value === 'true') return true;
  if (value === 'false' || value === null) return false;
  return value;
}

export function getTargetElement<T extends HTMLElement>(e: PointerEvent, tagName: string): T | null {
  const ele = e.target as T;
  if (ele?.tagName !== tagName) return null;
  return ele;
}

export function getButtonElement(e: PointerEvent): [string, HTMLButtonElement] | [null, null] {
  const button = getTargetElement<HTMLButtonElement>(e, 'BUTTON');
  if (!button) return [null, null];
  const type = button.dataset.type as string;
  return [type, button];
}

export function isAudioType(file: File) {
  return file.type.startsWith('audio/');
}

export function getFilename(file: File) {
  let ext: string = '';
  const name = file.name.replace(/\.(\w+)$/, (_, $0) => {
    ext = $0;
    return '';
  });
  return { name, ext };
}

export function mapRange(s: number, smin: number, smax: number, tmin: number, tmax: number): number {
  if (smin === smax) {
    throw new Error("Invalid range: [a, b] cannot have a zero length.");
  }
  return tmin + ((s - smin) / (smax - smin)) * (tmax - tmin);
}

export function debounce<T>(func: (...args: T[]) => void, delay: number) {
  let timer: number;
  return (...args: T[]) => {
    clearTimeout(timer);
    timer = window.setTimeout(() => {
      func(...args);
    }, delay);
  };
}

export async function* getFileRecursively<T extends FileSystemDirectoryHandle | FileSystemFileHandle>(entry: T): FileSystemDirectoryHandleAysncIterator<File> {
  if (entry.kind === 'file') {
    const file = await entry.getFile();
    if (file !== null) {
      yield file;
    }
  } else if (entry.kind === 'directory') {
    for await (const handle of entry.values()) {
      yield* getFileRecursively(handle as T);
    }
  }
}

export async function getMediaInfo(file: File | Blob) {
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
}

export function normalizeFile(info: InfoType, type: 'lrc' | 'cover') {
  if (type === 'lrc' && typeof info.lrcObject === 'object') {
    return info.lrc = URL.createObjectURL(info.lrcObject);
  }
  if (type === 'cover' && typeof info.coverObject === 'object') {
    return info.cover = URL.createObjectURL(info.coverObject);
  }
  return info[type];
}

export function cleanupBlobUrl(audio: HTMLAudioElement, info: InfoType) {
  [audio.src, info.lrc, info.cover].forEach(url => {
    if (url && url.startsWith('blob://')) {
      URL.revokeObjectURL(url);
    }
  });
}