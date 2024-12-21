import Box from '@/box-wrapper';
import Keyboard from '@/keyboard';
import { useStore } from '@/store';
import Hint from '@/ui/hint';
import Tooltip from '@/ui/tooltip';

import type { Component } from 'solid-js';

const App: Component = () => {
  const [store] = useStore();

  return [
    <div
      class="music-app flex h-screen w-screen items-center text-center text-[#666]"
      style={store.state.colors && {
        '--start-color': store.state.colors.start,
        '--end-color': store.state.colors.end,
      }}
    >
      <Box />
    </div>,
    <Tooltip />,
    <Hint />,
    <Keyboard />,
  ];
};

export default App;
