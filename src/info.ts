import ColorPalette from '@/ui/color-palette';
import { $, normalizeFile } from '@/utils';

import type { MusicBox } from '@/music-box';

export interface InfoType {
  title: string;
  album: string;
  artist: string;
  src: string;
  cover: string;
  lrc: string;
  coverObject?: File;
  lrcObject?: File;
  file?: File;
}

export class Info {
  musicBox: MusicBox;
  audio: HTMLAudioElement;
  cover = $<HTMLImageElement>('#cover')!;
  currentTime = $('.current-time')!;
  duration = $('.duration')!;
  currentInfo: InfoType = {} as InfoType;
  colorPalette = new ColorPalette();

  constructor(musicBox: MusicBox) {
    this.musicBox = musicBox;
    this.audio = musicBox.audio;
  }

  updateInfo() {
    this.reset();

    this.currentInfo = this.musicBox.list[this.musicBox.controls.index];
    this.setInfo(this.currentInfo);
  }

  setInfo(info: InfoType) {
    const defaultSrc = './images/unknown.bmp';
    this.cover.src = normalizeFile(info, 'cover') || defaultSrc;
    this.cover.onload = () => {
      this.cover.classList.add('loaded');
      this.getColorsFromImage(this.cover);
    };
    this.cover.onerror = () => {
      this.cover.src = defaultSrc;
    };

    const infoWrapper = $('.info-wrapper')!;
    const artist = $('h3', infoWrapper);
    const album = $('p', infoWrapper);
    const title = $('h1', infoWrapper);

    artist && (artist.textContent = info.artist);
    album && (album.textContent = info.album);
    title && (title.textContent = info.title);
  }

  setCurrentTime(time: number) {
    this.currentTime.textContent = formatTime(time);
  }

  setDuration(time: number) {
    this.duration.textContent = formatTime(time);
  }

  setTime(currentTime: number, duration: number) {
    this.setCurrentTime(currentTime);
    this.setDuration(duration);
  }

  reset() {
    this.cover.classList.remove('loaded');
    this.currentTime.textContent = '00:00';
    this.duration.textContent = '00:00';
  }

  getColorsFromImage(image: HTMLImageElement) {
    const mainColor = this.colorPalette.getColor(image);
    const palette = this.colorPalette.getPalette(image, 3);
    const body = $<HTMLBodyElement>('body')!;
    if (mainColor) {
      const [r, g, b] = mainColor;
      body.style.setProperty('--start-color', `rgb(${r},${g},${b})`);
    }
    if (palette?.length) {
      const [r, g, b] = palette[0];
      body.style.setProperty('--end-color', `rgb(${r},${g},${b})`);
    }
  }
}

function formatTime(time: number) {
  const m = Math.floor(time / 60);
  const s = Math.floor(time % 60);
  return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
}
