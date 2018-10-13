import { EditorFile } from './file.model';

export interface Tab {
  type: 'temp' | 'perm';
  file: EditorFile;
}

export function createTab(type: 'temp' | 'perm', file: EditorFile): Tab {
  return { type, file };
}
