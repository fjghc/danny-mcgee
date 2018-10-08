import { File } from '../file.model';

export interface Tab {
  type: 'temp' | 'perm';
  file: File;
}

export function createTab(type: 'temp' | 'perm', file: File): Tab {
  return { type, file };
}
