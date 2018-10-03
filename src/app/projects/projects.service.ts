import { EventEmitter, Injectable, Output } from '@angular/core';

import { Observable } from 'rxjs';

import { DatabaseService } from '../shared/database.service';
import { Project } from './project.model';

@Injectable({ providedIn: 'root' })
export class ProjectsService {

  @Output() closeActiveProject = new EventEmitter<string>();
  projectsObservable: Observable<any[]>;
  projects: Project[];

  constructor(private dbService: DatabaseService) {}

  fetchProjects() {
    this.projectsObservable = this.dbService.fetchData('projects');

    this.projectsObservable.subscribe(
      projects => {
        this.projects = projects;
      }
    );

    return this.projectsObservable;
  }

  getProjectByRef(ref: string): Project {
    for (const project of this.projects) {
      if (project.filesRef === ref) {
        return project;
      }
    }

    console.log(`ERROR: No project found with ref ${ref}`);
  }
}
