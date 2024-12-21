import {
  $storageGet,
  errorLogger,
  getFilename,
  getFileRecursively,
  getMediaInfo,
  isAudioType,
  normalizeFile,
} from '@/utils';

import { PlayMode } from '.';

import type { InfoType } from './types';

const addExtraInfo = (extraFiles: File[], list: InfoType[]) => {
  extraFiles.forEach((file) => {
    const filename = getFilename(file);
    const songItem = list.find(item => item.title === filename.name);
    if (!songItem) return;

    if (['lrc', 'txt'].includes(filename.ext)) {
      songItem.lrcObject = file;
    } else {
      songItem.coverObject = file;
    }
  });
};

export const getJsonSongs = () => {
  return fetch('list.json')
    .then(res => res.json())
    .then((res: InfoType[]) => {
      return res.map((item, index) => ({
        ...item,
        index,
        format: getFilename({ name: item.src }).ext,
      }));
    });
};

export const getSongs = async (dirHandle: FileSystemDirectoryHandle, list: InfoType[] = []) => {
  const newList = [...list];
  const extraFiles: File[] = [];

  let index = newList.length;
  for await (const file of getFileRecursively(dirHandle)) {
    if (!isAudioType(file)) {
      extraFiles.push(file);
      continue;
    }
    newList.push({
      index: index++,
      title: getFilename(file).name,
      file,
      format: file.type.split('audio/')[1],
    } as InfoType);
  }
  addExtraInfo(extraFiles, newList);

  return newList;
};

export const openDirHandler = async (list: InfoType[]) => {
  if (!window.showDirectoryPicker) {
    errorLogger('Not supported yet. Please use Chrome > 86 or Edge > 86 instead.');
    return [];
  }
  const dirHandle = await window.showDirectoryPicker();
  return getSongs(dirHandle, list);
};

export const PlayModeKey = 'play_mode';
export const getPlayMode = () => {
  return Number($storageGet(PlayModeKey, PlayMode.ORDER));
};

export const formatInfo = async (song: InfoType) => {
  const file = song.file;
  if (file) {
    song.src = URL.createObjectURL(file);

    if (!song.initMeta) {
      const { tags = {} } = await getMediaInfo(file) || {};
      song.title = tags.title || song.title;
      song.album = tags.album || song.album;
      song.cover = tags.picture || song.cover;
      song.artist = tags.artist || song.artist;
      song.initMeta = true;
    }
  }

  normalizeFile(song, 'cover');
  return song;
};
