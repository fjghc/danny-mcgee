import { EventEmitter, Injectable, OnDestroy, Output } from '@angular/core';

import { Observable, Subscription } from 'rxjs';

import { DatabaseService } from '../shared/database.service';
import { Project } from './project.model';

@Injectable({ providedIn: 'root' })
export class ProjectsService implements OnDestroy {

  @Output() closeActiveProject = new EventEmitter<string>();
  projectsObservable: Observable<any[]>;
  projects: Project[];
  subscription: Subscription;

  constructor(private dbService: DatabaseService) {}

  fetchProjects() {
    this.projectsObservable = this.dbService.fetchData('projects');

    this.subscription = this.projectsObservable.subscribe(
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

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }

}
