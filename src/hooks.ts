import { createSignal } from 'solid-js';

import type {
  Accessor,
  Component,
  Setter,
} from 'solid-js';

type RefType<T> = T extends Component<infer P> ? Parameters<P['ref']>[0] : T;
type RefValueType<T> = T extends Component<infer P> ? Accessor<Parameters<P['ref']>[0]> : Accessor<T>;
type ReturnRefType<T> = Setter<RefType<T>> & { current: RefValueType<T> };

type UseRefOptions = {
  signal?: boolean;
};

export function useRef<T>(initialValue?: RefType<T>, options: UseRefOptions = {}): ReturnRefType<T> {
  const signal = options.signal ?? false;

  if (signal) {
    const [element, setElement] = createSignal<RefType<T> | undefined>(initialValue);

    (setElement as any).current = element;

    return setElement as ReturnRefType<T>;
  }

  let element = initialValue;

  const setElement = (value: RefType<T>) => {
    element = value;
  };

  (setElement as any).current = () => element;

  return setElement as ReturnRefType<T>;
};

export function useElementSize<V, T extends HTMLElement = HTMLElement>(initialValue: V, onSizeChanged?: (setter: Setter<V>, entires: ResizeObserverEntry[], observer: ResizeObserver) => void, options?: ResizeObserverOptions): [
  size: Accessor<V>,
  element: Accessor<T>,
  setObserver: (ele: T) => void,
] {
  let element: T;
  const [size, setSize] = createSignal<V>(initialValue);

  return [
    size,
    () => element,
    (ele: T) => {
      if (!ele) return;
      element = ele;
      new ResizeObserver((...rest) => {
        onSizeChanged?.(setSize, ...rest);
      }).observe(ele, options);
    },
  ];
}
