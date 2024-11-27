import { $ } from '@/utils';
import { MusicBox } from '@/music-box';

export type InfoType = {
  title: string;
  album: string;
  artist: string;
  src: string;
  cover: string;
  lrc: string;
};

export class Info {
  musicBox: MusicBox;
  audio: HTMLAudioElement;
  cover = $<HTMLImageElement>('#cover')!;
  currentTime = $('.current-time')!;
  duration = $('.duration')!;
  currentInfo: InfoType = {} as InfoType;

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
    const infoWrapper = $('.info-wrapper')!;

    const artist = $('h3', infoWrapper);
    const album = $('p', infoWrapper);
    const title = $('h1', infoWrapper);

    this.cover.src = info.cover;
    this.cover.onload = () => {
      this.cover.classList.add('loaded');
    };
    this.cover.onerror = () => {
      this.cover.src = './images/unknown.bmp';
    };
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
}

function formatTime(time: number) {
  const m = Math.floor(time / 60);
  const s = Math.floor(time % 60);
  return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
}