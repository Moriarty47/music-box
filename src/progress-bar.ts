import { $, errorLogger } from '@/utils';

export class ProgressBar extends HTMLElement {
  static register(name: string = 'progress-bar') {
    customElements.define(name, this);
  }

  isSeeking: boolean = false;
  progressKey: string;
  progress: HTMLInputElement | null = null;
  onDragStart() { };
  onDragging() { };
  onDragEnd() { };
  constructor() {
    super();
    this.classList.add('progress-bar', 'w-full', 'h-full');
    this.progressKey = `--${this.dataset.varKey || 'percent'}`;
    this.render();
  }

  render() {
    const template = $<HTMLTemplateElement>('#progress-bar-template')!;

    this.appendChild(template.content.cloneNode(true));
  }

  connectedCallback() {
    this.progress = this.querySelector<HTMLInputElement>('input');

    this.initListener();
    this.setProgress('0');
  }

  initListener() {
    const progress = this.progress;
    if (!progress) {
      errorLogger('Not found progress element');
      return;
    }

    const rangeInput = () => {
      this.style.setProperty(this.progressKey, progress.value);
    };

    const pointerDownHandler = () => {
      this.isSeeking = true;
      this.classList.add('grabbing');
      this.onDragStart();

      const moveHandler = () => {
        this.isSeeking = true;
        this.onDragging();
      };

      const pointerUpHandler = () => {
        this.isSeeking = false;
        this.classList.remove('grabbing');
        this.onDragEnd();
        progress.removeEventListener('pointermove', moveHandler);
      };

      progress.addEventListener('pointermove', moveHandler);
      progress.addEventListener('pointerup', pointerUpHandler, { once: true });
    };

    progress.addEventListener('input', rangeInput);
    progress.addEventListener('pointerdown', pointerDownHandler);
  }

  getCurrentCursorPosition() {
    const progress = this.progress;
    if (!progress) return 0;
    return Number(progress.value) / 100;
  }

  setProgress(value: string) {
    const progress = this.progress;
    if (!progress) return;
    progress.value = value;
    progress.dispatchEvent(new Event('input'));
  }
}

ProgressBar.register('progress-bar');
