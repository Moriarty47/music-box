import {
  batch,
  type Component,
  createEffect,
  on,
} from 'solid-js';

import { useStore } from '@/store';

import ProgressBar from '.';

const SongProgress: Component = () => {
  const [store, dispatch] = useStore();

  const value = () => {
    const currentTime = store.state.currentTime;
    const duration = store.state.duration;
    if (currentTime === 0 || duration === 0) return 0;
    if (Number.isNaN(currentTime) || Number.isNaN(duration)) return 0;
    return (store.state.currentTime / store.state.duration) * 100;
  };

  const onDragStart = () => {
    dispatch('TOGGLE_SEEKING');
  };

  const onDragging = (process: number) => {
    dispatch('SET_DISPLAY_TIME', process * store.state.duration);
  };

  const onDragEnd = (process: number) => {
    batch(() => {
      dispatch('TOGGLE_SEEKING');
      store.song().player?.seek(process * store.state.duration);
    });
  };

  const resetProgress = () => {
    batch(() => {
      dispatch('SET_DISPLAY_TIME', 0);
      dispatch('SET_CURRENT_TIME', 0);
    });
  };

  createEffect(on(() => store.song().src, (curr, prev) => {
    if (curr !== prev) {
      resetProgress();
    }
  }, { defer: true }));

  return (
    <ProgressBar
      id="song-progress"
      value={value()}
      onDragStart={onDragStart}
      onDragging={onDragging}
      onDragEnd={onDragEnd}
    />
  );
};

export default SongProgress;
