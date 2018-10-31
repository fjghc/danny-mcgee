import { IconDefinition } from '@fortawesome/fontawesome-common-types';
import { DmIconDefinition } from '../shared/icon-definitions/icon-definition.model';

export interface Project {
  id: string;
  name: string;
  year: number;
  url: string;
  imageFormat: string;
  needsRefresh?: boolean;
  personal?: boolean;
  order?: number;
  responsibilities?: {
    icon: DmIconDefinition | IconDefinition,
    class: string,
    tooltip: string
  }[];
  tools?: {
    icon: DmIconDefinition | IconDefinition,
    class: string,
    tooltip: string
  }[];
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
