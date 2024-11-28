/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_APP_TITLE: string;
  // 更多环境变量...
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}

declare module "@lokesh.dhakar/quantize" {
  export type Color = [r: number, g: number, b: number];
  export default (pixelArray: number[][], colorCount: number) => ({
    palette(): Color[];
  });
}

interface HTMLAudioElement {
  playing: boolean;
}
type JSMEDIA_TAG = {
  type: 'MP4';
  ftype: string;
  version: number;
  tags: Record<string, { id: string; size: number; description: string; data: string; }>;
} | {
  type: 'FLAC',
  version: string;
  tags: {
    title?: string;
    artist?: string;
    album?: string;
    track?: string;
    picture?: string;
    genre?: string;
  };
};
interface Window {
  showDirectoryPicker?: (options?: {
    id?: string;
    mode?: 'read' | 'readwrite';
    startIn?: 'desktop' | 'documents' | 'downloads' | 'music' | 'pictures' | 'videos';
  }) => Promise<FileSystemDirectoryHandle>;
  jsmediatags: {
    read(file: File | Blob | string, callbacks: {
      onSuccess(tag: JSMEDIA_TAG): void;
      onError(error: any): void;
    });
  };
}

interface FileSystemDirectoryHandleAysncIterator<T> extends AsyncIteratorObject<T, BuiltinIteratorReturn, unknown> {
  [Symbol.asyncIterator](): FileSystemDirectoryHandleAysncIterator<T>;
}
interface FileSystemDirectoryHandle {
  values(): FileSystemDirectoryHandleAysncIterator<FileSystemHandle>;
}

