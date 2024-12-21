type CommonMethod =
  | 'requestFullscreen'
  | 'exitFullscreen'
  | 'fullscreenElement'
  | 'fullscreenEnabled'
  | 'fullscreenchange'
  | 'fullscreenerror';

const methodMap: readonly string[][] = [
  [
    'requestFullscreen',
    'exitFullscreen',
    'fullscreenElement',
    'fullscreenEnabled',
    'fullscreenchange',
    'fullscreenerror',
  ],
  // New WebKit
  [
    'webkitRequestFullscreen',
    'webkitExitFullscreen',
    'webkitFullscreenElement',
    'webkitFullscreenEnabled',
    'webkitfullscreenchange',
    'webkitfullscreenerror',

  ],
  // Old WebKit
  [
    'webkitRequestFullScreen',
    'webkitCancelFullScreen',
    'webkitCurrentFullScreenElement',
    'webkitCancelFullScreen',
    'webkitfullscreenchange',
    'webkitfullscreenerror',

  ],
  [
    'mozRequestFullScreen',
    'mozCancelFullScreen',
    'mozFullScreenElement',
    'mozFullScreenEnabled',
    'mozfullscreenchange',
    'mozfullscreenerror',
  ],
  [
    'msRequestFullscreen',
    'msExitFullscreen',
    'msFullscreenElement',
    'msFullscreenEnabled',
    'MSFullscreenChange',
    'MSFullscreenError',
  ],
];

const exist = Symbol('exist');

const nativeAPI = (() => {
  const apis = { [exist]: 'false' } as unknown as Record<CommonMethod | symbol, string>;
  if (typeof document === 'undefined') return apis;

  apis[exist] = 'true';

  const unprefixedMethods = methodMap[0];

  for (const methodList of methodMap) {
    const exitFullscreenMethod = methodList[1];
    if (exitFullscreenMethod in document) {
      for (const [index, method] of methodList.entries()) {
        apis[unprefixedMethods[index] as CommonMethod] = method;
      }
      return apis;
    }
  }
  return apis;
})();

const eventNameMap = {
  change: nativeAPI.fullscreenchange,
  error: nativeAPI.fullscreenerror,
};

class Fullscreen {
  request(element = document.documentElement, options?: FullscreenOptions) {
    return new Promise<void>((resolve, reject) => {
      const onFullscreenEntered = () => {
        this.off('change', onFullscreenEntered);
        resolve();
      };

      this.on('change', onFullscreenEntered);

      const requestFullscreenMethod = element[nativeAPI.requestFullscreen as keyof HTMLElement] as (options?: FullscreenOptions) => Promise<void> | void;

      Promise.resolve(requestFullscreenMethod.call(element, options))
        .then(onFullscreenEntered)
        .catch(reject);
    });
  }

  exit() {
    return new Promise<void>((resolve, reject) => {
      if (!this.isFullscreen) return resolve();

      const onFullscreenExited = () => {
        this.off('change', onFullscreenExited);
        resolve();
      };

      this.on('change', onFullscreenExited);

      const exitFullscreenMethod = document[nativeAPI.exitFullscreen as keyof Document] as () => Promise<void> | void;

      Promise.resolve(exitFullscreenMethod.call(document))
        .then(onFullscreenExited)
        .catch(reject);
    });
  }

  toggle(element: HTMLElement, options?: FullscreenOptions) {
    return this.isFullscreen ? this.exit() : this.request(element, options);
  }

  onChange(handler: EventListenerOrEventListenerObject) {
    this.on('change', handler);
  }

  onError(handler: EventListenerOrEventListenerObject) {
    this.on('error', handler);
  }

  on(event: 'change' | 'error', handler: EventListenerOrEventListenerObject) {
    const eventName = eventNameMap[event];
    if (!eventName) return;
    document.addEventListener(eventName, handler, false);
  }

  off(event: 'change' | 'error', handler: EventListenerOrEventListenerObject) {
    const eventName = eventNameMap[event];
    if (!eventName) return;
    document.removeEventListener(eventName, handler, false);
  }

  get __rawMap() { return nativeAPI; }

  get enabled() {
    return Boolean(document[nativeAPI.fullscreenEnabled as keyof Document]);
  }

  get isFullscreen() {
    return Boolean(document[nativeAPI.fullscreenElement as keyof Document]);
  }

  get element() {
    return document[nativeAPI.fullscreenElement as keyof Document];
  }
}

export default nativeAPI[exist] === 'true' ? new Fullscreen() : { enabled: false } as unknown as InstanceType<typeof Fullscreen>;
