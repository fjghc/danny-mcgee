export interface Project {

  id: string;
  name: string;
  year: number;
  url: string;
  imageFormat: string;
  needsRefresh?: boolean;
  order?: number;

}

export function createProject(
  id?: string,
  name?: string,
  year?: number,
  url?: string,
  imageFormat?: string,
  needsRefresh = false,
): Project {
  return {
    id, name, year, url, imageFormat, needsRefresh
  };
}
