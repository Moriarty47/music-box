import {
  batch,
  type Component,
  createEffect,
  createSignal,
  on,
} from 'solid-js';

import { useStore } from '@/store';
import { cleanupBlobUrl, deferred } from '@/utils';

import { getColorsFromImage } from '../info/colors';

const defaultSrc = './images/unknown.bmp';

type CoverProps = {
  src: string;
};

const fetchImageOnBg = async (src: string) => {
  const dfd = deferred<string>();
  const img = new Image();
  img.onload = () => dfd.resolve(src);
  img.onerror = () => dfd.reject(false);
  img.src = src;
  return dfd.promise;
};

const Cover: Component<CoverProps> = (props) => {
  const [_, dispatch] = useStore();
  const [loaded, setLoaded] = createSignal(false);
  const [prevSrc, setPrevSrc] = createSignal(defaultSrc);
  const [src, setSrc] = createSignal(defaultSrc);

  const imageHandler = async (currSrc: string, prevSrc: string) => {
    if (currSrc === prevSrc) return;
    const src = await (fetchImageOnBg(currSrc).catch(r => r));
    cleanupBlobUrl(prevSrc);
    setTimeout(() => {
      batch(() => {
        setSrc(src === false ? defaultSrc : currSrc);
        setLoaded(true);
      });
    }, 300);
  };

  const loadedHandler = (e: Event) => {
    dispatch('SET_COLORS', getColorsFromImage(e.target as HTMLImageElement));
  };

  createEffect(on(() => props.src, async (currSrc) => {
    batch(() => {
      setPrevSrc(src());
      setLoaded(false);
    });
    imageHandler(currSrc, prevSrc());
  }));

  return (
    <div class="group relative z-10 rounded-inherit" classList={{ loaded: loaded() }}>
      <img
        alt="Album cover"
        class="shadow-middleduration-300 relative block h-[12.5rem] max-w-full rounded-inherit border border-transparent object-cover ease-in"
        draggable="false"
        width="100%"
        height="200"
        src={prevSrc()}
      />
      <img
        alt="Album cover"
        class="absolute left-0 top-0 block h-[12.5rem] max-w-full rounded-inherit border border-transparent object-cover opacity-0 shadow-middle transition-opacity duration-300 ease-in group-[.loaded]:opacity-100"
        draggable="false"
        width="100%"
        height="200"
        src={src()}
        onLoad={loadedHandler}
      />
    </div>
  );
};

export default Cover;
