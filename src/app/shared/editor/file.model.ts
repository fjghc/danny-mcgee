export interface File {
  name: string;
  type: string;
  contents?: File[] | string;
  initialContent?: string;
  path?: string;
}

export function createFile(
  name?: string,
  type?: string,
  contents?: File[] | string,
  initialContent?: string,
  path?: string
) {
  return {
    name, type, contents, initialContent, path
  };
}
