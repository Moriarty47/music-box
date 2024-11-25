async function main() {
  const lyricLines = await parseLayrcs();

  const container = document.querySelector('.container');
  const lrcList = document.querySelector('.lrc-list');
  const audio = document.querySelector('audio');
  createLyricsDom(lyricLines, lrcList);

  const containerHeight = container.clientHeight;
  const liHeight = lrcList.firstElementChild.clientHeight;

  const initOffset = containerHeight / 2 - liHeight / 2;
  lrcList.style.transform = `translateY(${initOffset}px)`;

  audio.volume = 0.5;
  audio.addEventListener('timeupdate', () => {
    const index = findLyricsIndex(audio.currentTime, lyricLines);

    setUlOffset(lrcList, index, liHeight, initOffset);

    highlightLine(lrcList, index);
  });
}

main();
let lastIndex = 0;

/**
 * @param {HTMLUListElement} lrcList 
 * @param {number} index 
 */
function highlightLine(lrcList, index) {
  if (lastIndex === index) return;
  lrcList.children[lastIndex]?.classList.remove('active');
  lrcList.children[index]?.classList.add('active');
  lastIndex = index;
}

function setUlOffset(lrcList, currentIndex, liHeight, initOffset) {
  const offset = initOffset - currentIndex * liHeight;
  lrcList.style.transform = `translateY(${offset}px)`;
}

/**
 * @param {number} time 
 * @param {{time: number; line: string;}[]} lyrics 
 * @return {number}
 */
function findLyricsIndex(time, lyrics) {
  let index = 0;
  for (let i = 0; i < lyrics.length; i++) {
    if (lyrics[i].time > time) break;
    index = i;
  }
  return index;
}

/**
 * @param {{time: number; line: string;}[]} lyricLines 
 * @param {HTMLUListElement} lrcList 
 */
function createLyricsDom(lyricLines, lrcList) {
  const frags = document.createDocumentFragment();
  lyricLines.forEach(({ time, line }, i) => {
    const li = document.createElement('li');
    li.innerHTML = line;
    li.dataset.time = time;
    frags.appendChild(li);
  });
  lrcList.appendChild(frags);
}

async function parseLayrcs() {
  return (await fetchLyrics()).split('\n').map(line => {
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

async function fetchLyrics() {
  const response = await fetch('../assets/许嵩-庐州月.lrc');
  return await response.text();
};