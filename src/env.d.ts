/// <reference types="@rsbuild/core/types" />

declare module '*.css' {
  const classes: CSSModuleClasses;
  export default classes;
}

declare module '@lokesh.dhakar/quantize' {
  export type Color = [r: number, g: number, b: number];
  declare const quantize: (pixelArray: number[][], colorCount: number) => { palette: () => Color[] };
  export default quantize;
}

interface HTMLAudioElement {
  playing: boolean;
}
type JSMEDIA_TAG =
  // Omit MP4 type
  // | {
  //   type: 'MP4';
  //   ftype: string;
  //   version: number;
  //   tags: Record<string, { id: string; size: number; description: string; data: string }>;
  // }
  | {
    type: 'FLAC';
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
    read: (file: File | Blob | string, callbacks: {
      onSuccess: (tag: JSMEDIA_TAG) => void;
      onError: (error: any) => void;
    }) => any;
  };
}

interface FileSystemDirectoryHandleAysncIterator<T> extends AsyncIteratorObject<T, BuiltinIteratorReturn, unknown> {
  [Symbol.asyncIterator]: () => FileSystemDirectoryHandleAysncIterator<T>;
}
interface FileSystemDirectoryHandle {
  values: () => FileSystemDirectoryHandleAysncIterator<FileSystemHandle>;
}
