import type { Component } from 'solid-js';

const ProgressBar: Component<{
  id: string;
}> = (props) => {
  return (
    <div id={props.id} class="progress-bar-wrapper relative flex items-center gap-2 [container-type:inline-size]">
      <div
        class="track relative mx-0 my-2 flex h-1 w-full overflow-hidden rounded-full border-transparent border-s-foreground bg-foreground-track/30"
      >
        <div
          class="filler absolute left-0 h-full w-full translate-x-[calc((100-var(--percent))*-1%)] rounded-full bg-foreground"
        />
      </div>
      <div
        class="thumb pointer-events-none absolute -left-1 top-[calc(50%-.25rem)] flex h-2 w-2 translate-x-[calc(var(--percent)*1cqw)] touch-none items-center justify-center rounded-full border-0 bg-foreground shadow-offset"
      />
      <input
        class="progress absolute -left-2 h-1 w-[calc(100%+1rem)] appearance-none bg-transparent opacity-0"
        tabindex="0"
        min="0"
        max="100"
        step="0.1"
        type="range"
      />
    </div>
  );
};

export default ProgressBar;
