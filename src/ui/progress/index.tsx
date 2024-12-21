import {
  createEffect,
  createSignal,
  on,
  type ParentComponent,
} from 'solid-js';

type ProgressBarProps = {
  id: string;
  value?: string | number;
  varKey?: string;
  onChange?: (value: number) => void;
  onDragStart?: (value: number, e: PointerEvent) => void;
  onDragging?: (value: number, e: PointerEvent) => void;
  onDragEnd?: (value: number, e: PointerEvent) => void;
};

const ProgressBar: ParentComponent<ProgressBarProps> = (props) => {
  const [progress, setProgress] = createSignal(0);
  const [seeking, setSeeking] = createSignal(false);
  const progressKey = () => `--${props.varKey || 'percent'}`;

  const getNormalizedProgress = () => {
    return progress() / 100;
  };

  const pointerMoveHandler = (e: PointerEvent) => {
    const normalizedProgress = getNormalizedProgress();
    props.onDragging?.(normalizedProgress, e);
    props.onChange?.(normalizedProgress);
  };

  const pointerUpHandler = (e: PointerEvent) => {
    setSeeking(false);
    const normalizedProgress = getNormalizedProgress();
    props.onDragEnd?.(normalizedProgress, e);
    props.onChange?.(normalizedProgress);

    const inputEle = e.target as HTMLInputElement | null;
    if (!inputEle) return;

    inputEle.removeEventListener('pointermove', pointerMoveHandler);
  };

  const pointerDownHandler = (e: PointerEvent) => {
    setSeeking(true);
    const normalizedProgress = getNormalizedProgress();
    props.onDragStart?.(normalizedProgress, e);
    props.onChange?.(normalizedProgress);

    const inputEle = e.target as HTMLInputElement | null;
    if (!inputEle) return;

    inputEle.addEventListener('pointermove', pointerMoveHandler);
    inputEle.addEventListener('pointerup', pointerUpHandler, { once: true });
  };

  createEffect(on(() => props.value, () => {
    setProgress(Number(props.value));
  }));

  return (
    <div
      id={props.id}
      class="progress-bar size-full"
      classList={{
        [seeking() ? 'grabbing' : '']: true,
      }}
      style={{
        [progressKey()]: progress(),
      }}
    >
      <div
        class="progress-bar-wrapper relative flex items-center gap-2 [container-type:inline-size]"

      >
        <div
          class="track relative mx-0 my-2 flex h-1 w-full overflow-hidden rounded-full border-transparent border-s-foreground bg-foreground-track/30"
        >
          <div
            class="filler absolute left-0 size-full translate-x-[calc((100-var(--percent))*-1%)] rounded-full bg-foreground"
          />
        </div>
        <div
          class="thumb pointer-events-none absolute -left-1 top-[calc(50%-.25rem)] flex size-2 translate-x-[calc(var(--percent)*1cqw)] touch-none items-center justify-center rounded-full border-0 bg-foreground shadow-offset"
        />
        <input
          class="progress absolute -left-2 h-1 w-[calc(100%+1rem)] cursor-grab appearance-none bg-transparent opacity-0"
          tabindex="0"
          min="0"
          max="100"
          step="0.1"
          type="range"
          value={progress()}
          onInput={e => setProgress(e.currentTarget.valueAsNumber)}
          on:pointerdown={pointerDownHandler}
        />
      </div>
      {props.children}
    </div>
  );
};

export default ProgressBar;
