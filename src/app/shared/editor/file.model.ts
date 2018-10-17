import { IconDefinition } from '@fortawesome/fontawesome-common-types';

export interface EditorFile {
  name: string;
  type: string;
  contents?: EditorFile[] | string;
  initialContent?: string;
  path?: string;
  isNewOrModified?: boolean;
  icon?: IconDefinition;
}

export function createFile(
  name?: string,
  type?: string,
  contents?: EditorFile[] | string,
  initialContent?: string,
  path?: string,
  isNewOrModified?: boolean,
  icon?: IconDefinition
) {
  return {
    name, type, contents, initialContent, path, isNewOrModified, icon
  };
}
