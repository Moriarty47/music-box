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