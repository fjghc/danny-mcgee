import { EditorFile } from './file.model';

export interface Tab {
  type: 'temp' | 'perm';
  file: EditorFile;
  editorOptions: Object;
}

export function createTab(type: 'temp' | 'perm', file: EditorFile, editorOptions: Object): Tab {
  return { type, file, editorOptions };
}
