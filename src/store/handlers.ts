import {
  $storageGet,
  errorLogger,
  getFilename,
  getFileRecursively,
  isAudioType,
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

export const getSongs = async (dirHandle: FileSystemDirectoryHandle, list: InfoType[] = []) => {
  const newList = [...list];
  const extraFiles: File[] = [];

  for await (const file of getFileRecursively(dirHandle)) {
    if (!isAudioType(file)) {
      extraFiles.push(file);
      continue;
    }
    newList.push({ title: getFilename(file).name, file } as InfoType);
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
