/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_APP_TITLE: string;
  // 更多环境变量...
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}

declare module 'virtual:$global' {
  export function $<T extends HTMLElement>(selectors: string, parent?: Document | HTMLElement | T): T | null;
}