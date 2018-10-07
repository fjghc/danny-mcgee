export interface Project {

  id: string;
  name: string;
  year: number;
  url: string;
  imageFormat: string;
  needsRefresh?: boolean;
  personal?: boolean;
  order?: number;

}

export function createProject(
  id?: string,
  name?: string,
  year?: number,
  url?: string,
  imageFormat?: string,
  needsRefresh = false,
  personal = false
): Project {
  return {
    id, name, year, url, imageFormat, needsRefresh, personal
  };
}
