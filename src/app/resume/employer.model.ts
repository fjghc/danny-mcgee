import { DmIconDefinition } from '../shared/icon-definitions/icon-definition.model';
import { IconDefinition } from '@fortawesome/fontawesome-common-types';
import { Project } from '../projects/project.model';

export interface Employer {
  id: string;
  companyName: string;
  title: string;
  dateStart: number;
  dateEnd: number;
  firestoreKey: number;
  responsibilities?: string[];
  tools?: {
    class: string,
    icon: DmIconDefinition | IconDefinition
  }[];
  languages?: {
    class: string,
    icon: DmIconDefinition | IconDefinition
  }[];
  projects?: Project[];
}

export function createEmployer(
  id: string,
  companyName: string,
  title: string,
  dateStart: number,
  dateEnd: number,
  firestoreKey: number,
): Employer {
  return {
    id: id,
    companyName: companyName,
    title: title,
    dateStart: dateStart,
    dateEnd: dateEnd,
    firestoreKey: firestoreKey
  };
}
