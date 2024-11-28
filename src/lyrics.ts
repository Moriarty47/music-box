import { $, errorLogger } from '@/utils';

type LyricLineItem = { time: number; line: string; };

export class Lyrics {
  visible: boolean = false;
  lastIndex: number = 0;
  liHeight: number = 0;
  containerHeight: number = 0;
  initOffset: number = 0;
  lyricLines: LyricLineItem[] = [];
  lyricEle: HTMLUListElement = $<HTMLUListElement>('.lrc-list')!;

  constructor() {
    this.renderLyrics = this.renderLyrics.bind(this);
  }

  async display(url: string) {
    return parseLyrics(url).then(this.renderLyrics);
  }

  renderLyrics(lyricLines: LyricLineItem[] = []) {
    this.lyricLines = lyricLines;
    createLyricsDom(lyricLines, this.lyricEle);
    this.containerHeight = this.lyricEle.parentElement?.clientHeight || 200;
    this.liHeight = this.lyricEle.firstElementChild?.clientHeight || 30;

    this.initOffset = this.containerHeight / 2 - this.liHeight / 2;
    this.lyricEle.style.transform = `translateY(${this.initOffset}px)`;
  }

  highlightLine(currentTime: number) {
    if (this.lyricLines.length <= 1) return;
    const index = findLyricsIndex(currentTime, this.lyricLines);
    this.setUlOffset(index);

    if (this.lastIndex === index) return;
    this.lyricEle.children[this.lastIndex]?.classList.remove('active');
    this.lyricEle.children[index]?.classList.add('active');
    this.lastIndex = index;
  }

  setUlOffset(currentIndex: number) {
    const offset = this.initOffset - currentIndex * this.liHeight;
    this.lyricEle.style.transform = `translateY(${offset}px)`;
  }
}

function findLyricsIndex(time: number, lyrics: LyricLineItem[]) {
  let index = 0;
  for (let i = 0; i < lyrics.length; i++) {
    if (lyrics[i].time > time) break;
    index = i;
  }
  return index;
}

function createLyricsDom(lyricLines: LyricLineItem[], lrcList: HTMLUListElement) {
  if (lyricLines.length <= 1) {
    lrcList.innerHTML = `<li>${lyricLines[0].line}</li>`;
    return;
  }
  const frags = document.createDocumentFragment();
  lyricLines.forEach(({ line }) => {
    const li = document.createElement('li');
    li.innerHTML = line;
    frags.appendChild(li);
  });
  lrcList.replaceChildren(frags);
}

async function parseLyrics(url: string): Promise<LyricLineItem[]> {
  return (await fetchLyrics(url))
    .split('\n')
    .map(line => {
      const matched = line.match(/\[(.*)\](.*)/);
      if (matched) {
        const [m, s, ms] = matched[1].split(/\:|\./);
        const time = Number(m) * 60 + Number(s) + Number(ms) / 100;

        return {
          time,
          line: matched[2],
        };
      }
      return {
        time: 0,
        line: line,
      };
    });
}

async function fetchLyrics(url: string) {
  try {
    if (!url) throw 'No lyrics found.';
    const response = await fetch(url, {
      headers: { 'Content-type': 'text/plain' }
    });
    if (response.status === 200) {
      return response.text();
    }
    throw await response.text();
  } catch (error) {
    errorLogger(error);
    return '暂无歌词';
  }
}