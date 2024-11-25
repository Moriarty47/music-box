import '@/styles/index.css';
import '@/styles/music-box.css';


import { MusicBox } from '@/music-box';

new MusicBox([
  {
    title: '沉默是金',
    album: 'Hot Summer',
    artist: '张国荣',
    src: './audio/1.wav',
    cover: './audio/张国荣-沉默是金.bmp',
    lrc: './audio/张国荣-沉默是金.lrc',
  },
  {
    title: '庐州月',
    album: '寻雾启示',
    artist: '许嵩',
    src: './audio/2.flac',
    cover: './audio/许嵩-庐州月.bmp',
    lrc: './audio/许嵩-庐州月.lrc',
  },
  {
    title: '惊鸿一面',
    album: '不如去吃茶',
    artist: '许嵩_黄龄',
    src: './audio/3.flac',
    cover: './audio/许嵩_黄龄-惊鸿一面.bmp',
    lrc: './audio/许嵩_黄龄-惊鸿一面.lrc',
  }
]);
