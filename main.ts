import { MusicBox } from '@/music-box';
import { errorLogger } from '@/utils';

import '@/styles/index.css';

import type { InfoType } from '@/info';

fetch('./list.json')
  .then(res => res.json())
  .then((res) => {
    createMusicBox(res);
  })
  .catch((error) => {
    errorLogger(error);
    createMusicBox([]);
  });

function createMusicBox(res: InfoType[]) {
  if (res.length === 0) {
    res.push({
      title: 'Music Box',
    } as InfoType);
  }
  return new MusicBox(res);
}
