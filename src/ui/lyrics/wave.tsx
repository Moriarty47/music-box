import { Howler } from 'howler';
import {
  type Component,
  createEffect,
  on,
  onMount,
} from 'solid-js';

import { useRef } from '@/hooks';
import { useStore } from '@/store';

type WaveProps = {
  size: {
    width: number;
    height: number;
  };
  fullscreen: boolean;
};
const Wave: Component<WaveProps> = (props) => {
  const [store] = useStore();
  const canvasRef = useRef<HTMLCanvasElement>();
  let canvasCtx: CanvasRenderingContext2D;
  let WIDTH = 0;
  let HEIGHT = 0;
  let opacity = 0.3;
  let rafId: number | null = null;
  let analyser: AnalyserNode;
  // let audioSourceNode: MediaElementAudioSourceNode;

  const caf = () => {
    rafId && cancelAnimationFrame(rafId);
    rafId = null;
  };

  function initAnalyzer() {
    const audioCtx = Howler.ctx;

    analyser = audioCtx.createAnalyser();
    Howler.masterGain.connect(analyser);
    analyser.fftSize = 512;
    analyser.minDecibels = -90;
    analyser.maxDecibels = -10;
    analyser.smoothingTimeConstant = 0.5;
    const audio = (store.song().player as any)?._sounds[0]._node as MediaElementAudioSourceNode;
    audio.disconnect();
    audio.connect(analyser);
    // if (audioSourceNode) return;
    // const audio = (store.song().player as any)?._sounds[0]._node as HTMLAudioElement;
    // audioSourceNode = audioCtx.createMediaElementSource(audio);
    // audioSourceNode.connect(analyser);
    analyser.connect(audioCtx.destination);
  };

  const drawWave = (
    bufferLength: number,
    barWidth: number,
    data: Uint8Array,
  ) => {
    for (let i = 0; i < bufferLength; i++) {
      const barHeight = data[i] * 4;
      canvasCtx.save();
      canvasCtx.translate(WIDTH / 2, HEIGHT / 2);
      canvasCtx.rotate(i * Math.PI * 8 / bufferLength);

      canvasCtx.fillStyle = `hsla(${i * 2},100%,50%,${opacity})`;
      canvasCtx.fillRect(0, 0, barWidth, barHeight);
      canvasCtx.restore();
    }
  };

  const drawCanvas = () => {
    if (!canvasCtx) return;

    const bufferLength = analyser.frequencyBinCount;
    const dataArray = new Uint8Array(bufferLength);

    const barWidth = WIDTH / 2 / bufferLength;

    const draw = () => {
      canvasCtx.clearRect(0, 0, WIDTH, HEIGHT);
      // analyser.getByteTimeDomainData(dataArray);
      analyser.getByteFrequencyData(dataArray);

      drawWave(bufferLength, barWidth, dataArray);

      rafId = requestAnimationFrame(draw);
    };

    rafId = requestAnimationFrame(draw);
  };

  onMount(() => {
    const canvas = canvasRef.current();
    if (!canvas) return;
    canvasCtx = canvas.getContext('2d')!;
  });

  createEffect(on(() => props.fullscreen, (fullscreen) => {
    if (fullscreen) {
      opacity = 1;
    } else {
      opacity = 0.3;
    }
  }));

  createEffect(on(() => props.size, ({ width, height }) => {
    const canvas = canvasRef.current();
    if (!canvas) return;
    WIDTH = canvas.width = width;
    HEIGHT = canvas.height = height;
  }));

  createEffect(on(() => store.state.running, (running) => {
    if (running) {
      drawCanvas();
    } else {
      caf();
    }
  }));

  createEffect(on(() => store.song().src, (curr, prev) => {
    if (curr !== prev) {
      setTimeout(() => {
        initAnalyzer();
      }, 50);
    }
  }));

  return (
    <div class="absolute inset-x-0 inset-y-[12px_0] group-[.fullscreen]:absolute group-[.fullscreen]:inset-0 group-[.fullscreen]:-z-10">
      <canvas ref={canvasRef} id="sound-wave" class="size-full blur-md saturate-150" />
    </div>
  );
};

export default Wave;
