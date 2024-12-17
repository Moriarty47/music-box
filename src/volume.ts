import { $, mapRange } from '@/utils';

import type { Controls } from '@/controls';
import type { ProgressBar } from '@/progress-bar';

export class Volume {
  controls: Controls;
  audio: HTMLAudioElement;
  progressBar: ProgressBar;
  tooltip: HTMLDivElement | null = null;
  button = $<HTMLButtonElement>(`[data-type="MUTED"]`)!;

  constructor(controls: Controls) {
    this.controls = controls;
    this.audio = controls.audio;
    this.progressBar = $<ProgressBar>('#volume-progress')!;
    this.initPointerListener();
    this.initVolumeListener();
    // init volume
    this.volumeChange(this.audio.volume);
    this.initPosition();
  }

  initPointerListener() {
    const pointerLeaveHandler = () => {
      this.#close();
    };

    const pointerEnterHandler = () => {
      this.#open();
      if (!this.tooltip) return;

      this.tooltip.addEventListener('pointerenter', pointerEnterHandler, { once: true });
      this.tooltip.addEventListener('pointerleave', pointerLeaveHandler, { once: true });
    };

    this.button.addEventListener('pointerenter', pointerEnterHandler, false);
    this.button.addEventListener('pointerleave', pointerLeaveHandler, false);
  }

  initVolumeListener() {
    const progress = this.progressBar.progress;

    this.progressBar.onDragging = this.progressBar.onDragEnd = () => {
      if (!progress) return;
      this.updateVolume(Number(progress.value));
    };
    this.audio.addEventListener('volumechange', () => {
      this.volumeChange(this.audio.volume);
    }, false);
  }

  initPosition(tooltip?: HTMLDivElement) {
    const { left, top } = this.button.getBoundingClientRect();
    const offsetX = left - 36;
    const offsetY = top - 15;
    this.tooltip = tooltip || $<HTMLDivElement>('#volume-tooltip')!;
    this.tooltip.style.setProperty('--l', `${offsetX}px`);
    this.tooltip.style.setProperty('top', `${offsetY}px`);
  }

  #open() {
    this.tooltip = $<HTMLDivElement>('#volume-tooltip')!;
    this.initPosition(this.tooltip);
    this.tooltip.setAttribute('open', '');
  }

  #close() {
    this.tooltip?.removeAttribute('open');
    this.tooltip = null;
  }

  updateVolume(volume: number) {
    const vol = mapRange(
      volume > 100 ? 100 : volume,
      0,
      100,
      0,
      1,
    );
    this.audio.volume = vol;
  }

  volumeChange(volume: number) {
    const button = this.button;
    this.progressBar.setProgress(String(volume * 100));
    if (this.audio.muted || volume === 0) {
      button.classList.add('muted');
      return;
    }
    button.classList.remove('muted');
    if (volume > 0 && volume <= 0.3) {
      button.classList.remove('high');
      button.classList.remove('middle');
    } else if (volume > 0.3 && volume <= 0.6) {
      button.classList.remove('high');
      button.classList.add('middle');
    } else if (volume > 0.6) {
      button.classList.remove('middle');
      button.classList.add('high');
    }
  }
}
