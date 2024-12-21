import { errorLogger } from '@/utils';

interface LyricLineItem { time: number; line: string }

export function findLyricsIndex(time: number, lyrics: LyricLineItem[]) {
  let index = 0;
  for (let i = 0; i < lyrics.length; i++) {
    if (lyrics[i].time > time) break;
    index = i;
  }
  return index;
}

export async function parseLyrics(url: string): Promise<LyricLineItem[]> {
  return (await fetchLyrics(url))
    .split('\n')
    .map((line) => {
      const matched = line.match(/\[(.*)\](.*)/);
      if (matched) {
        const [m, s, ms] = matched[1].split(/:|\./);
        const time = Number(m) * 60 + Number(s) + Number(ms) / 100;

        return {
          time,
          line: matched[2],
        };
      }
      return {
        time: 0,
        line,
      };
    });
}

export async function fetchLyrics(url: string) {
  if (url === 'normal') return '暂无歌词';
  if (url === 'default') return 'Lyrics';
  try {
    const response = await fetch(url, {
      headers: { 'Content-type': 'text/plain' },
    });
    if (response.status === 200) {
      return response.text();
    }
    throw await response.text();
  } catch (error: any) {
    errorLogger(error.message || error);
    return '暂无歌词';
  }
}
