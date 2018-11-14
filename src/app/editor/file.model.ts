import { IconDefinition } from '@fortawesome/fontawesome-common-types';
import { DmIconDefinition } from '../shared/icon-definitions/icon-definition.model';

export interface EditorFile {
  name: string;
  type: string;
  contents?: EditorFile[] | string;
  initialContent?: string;
  path?: string;
  isNewOrModified?: boolean;
  icon?: IconDefinition | DmIconDefinition;
}

export function createFile(
  name?: string,
  type?: string,
  contents?: EditorFile[] | string,
  initialContent?: string,
  path?: string,
  isNewOrModified?: boolean,
  icon?: IconDefinition | DmIconDefinition
) {
  return {
    name, type, contents, initialContent, path, isNewOrModified, icon
  };
}
