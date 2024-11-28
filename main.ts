import '@/styles/index.css';

import { MusicBox } from '@/music-box';

fetch('./list.json')
  .then(res => res.json())
  .then(res => {
    new MusicBox(res);
  });
