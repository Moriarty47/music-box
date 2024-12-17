import { createSignal } from 'solid-js';

import type { Accessor, Setter } from 'solid-js';

export function useDomRef<T>(initialValue: T) {
  const [element, setElement] = createSignal<T>(initialValue);

  (setElement as any).value = element;

  return setElement as Setter<T> & {
    value: Accessor<T>;
  };
};
