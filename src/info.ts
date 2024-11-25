import { $ } from 'virtual:$global';
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
  musicBox: InstanceType<typeof MusicBox>;
  audio: HTMLAudioElement;
  cover: HTMLImageElement;
  currentTime: HTMLElement;
  duration: HTMLElement;

  constructor(musicBox: InstanceType<typeof MusicBox>) {
    this.musicBox = musicBox;
    this.audio = musicBox.audio;
    this.cover = $<HTMLImageElement>('#cover')!;
    this.currentTime = $('.current-time')!;
    this.duration = $('.duration')!;
  }

  updateInfo() {
    this.reset();
    this.setInfo(this.musicBox.list[this.musicBox.controls.index]);
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