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

export function getFilename(file: File) {
  return file.name.replace(/\.\w+$/, '');
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