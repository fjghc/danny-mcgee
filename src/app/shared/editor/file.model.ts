export interface EditorFile {
  name: string;
  type: string;
  contents?: EditorFile[] | string;
  initialContent?: string;
  path?: string;
  isNewOrModified?: boolean;
}

export function createFile(
  name?: string,
  type?: string,
  contents?: EditorFile[] | string,
  initialContent?: string,
  path?: string,
  isNewOrModified?: boolean
) {
  return {
    name, type, contents, initialContent, path, isNewOrModified
  };
}
