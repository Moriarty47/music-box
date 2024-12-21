import { type Component, For } from 'solid-js';

import RippleButton, { ButtonType } from '@/ui/button/ripple-button';
import {
  ArrowDown,
  ArrowLeft,
  ArrowRight,
  ArrowUp,
  Command,
  KeyF,
  KeyM,
  Slash,
  Space,
} from '@/ui/icons/kbd';

const keysMap = {
  Space: () => <Space />,
  ArrowUp: () => <ArrowUp />,
  ArrowDown: () => <ArrowDown />,
  ArrowLeft: () => <ArrowLeft />,
  ArrowRight: () => <ArrowRight />,
  KeyF: () => <KeyF />,
  KeyM: () => <KeyM />,
  Slash: () => <Slash />,
  Ctrl: () => <Command />,
} as const;

const shortcuts = [
  { key: 'Space', desc: '播放/暂停' },
  { key: 'ArrowLeft', desc: '前进10秒' },
  { key: 'ArrowRight', desc: '后退10秒' },
  { key: 'ArrowUp', desc: '音量+' },
  { key: 'ArrowDown', desc: '音量-' },
  { key: 'Slash', desc: '歌词' },
  { key: 'KeyF', desc: '全屏' },
  { key: 'KeyM', desc: '静音' },
  { key: 'Ctrl+KeyM', desc: '播放模式' },
  { key: 'Ctrl+ArrowLeft', desc: '上一首' },
  { key: 'Ctrl+ArrowRight', desc: '下一首' },
];

const Key: Component<{
  type: string;
}> = (props) => {
  const keys = () => props.type.split('+') as (keyof typeof keysMap)[];

  return (
    <span class="inline-flex gap-1">
      <For each={keys()}>
        {key => (
          <kbd class="bg-transparent text-white">{keysMap[key]()}</kbd>
        )}
      </For>
    </span>
  );
};

const Hint: Component = () => {
  return (
    <div class="group fixed bottom-4 right-4 size-10">
      <div class="absolute bottom-8 right-8 flex size-max origin-bottom-right scale-0 flex-col justify-evenly gap-3 rounded-xxxl bg-default/50 p-3 text-xs font-semibold text-foreground backdrop-blur-md backdrop-saturate-150 transition-transform duration-300 ease-in-out group-hover:scale-100">
        <For each={shortcuts}>
          {shortcut => (
            <div class="flex min-w-40 items-center justify-between">
              <span>{shortcut.desc}</span>
              <Key type={shortcut.key} />
            </div>
          )}
        </For>
      </div>
      <RippleButton type={ButtonType.HINT} sizeCls="size-10" title="快捷键" />
    </div>
  );
};

export default Hint;
