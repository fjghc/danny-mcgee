import { EventEmitter, Injectable, OnDestroy, Output } from '@angular/core';

import { BehaviorSubject, Observable, Subscription } from 'rxjs';

import { DatabaseService } from '../shared/database.service';
import { Project } from './project.model';

@Injectable({ providedIn: 'root' })
export class ProjectsService implements OnDestroy {

  @Output() closeActiveProject = new EventEmitter();
  @Output() newProject = new EventEmitter();
  editMode = new BehaviorSubject<boolean>(false);
  projectsObservable: Observable<Project[]>;
  projects: Project[];
  subscription: Subscription;

  constructor(private dbService: DatabaseService) {}

  fetchProjects(): Observable<Project[]> {
    this.projectsObservable = this.dbService.fetchCollection('projects') as Observable<Project[]>;

    this.subscription = this.projectsObservable.subscribe(
      projects => {
        this.projects = projects;
      }
    );

    return this.projectsObservable;
  }

  getProject(id: string): Project {
    for (const project of this.projects) {
      if (project.id === id) {
        return project;
      }
    }

    console.log(`ERROR: No project found with id ${id}`);
  }

  indexOf(id: string): number {
    for (const project of this.projects) {
      if (project.id === id) {
        return this.projects.indexOf(project);
      }
    }
  }

  toggleEditMode() {
    this.editMode.next(!this.editMode.getValue());
  }

  addOrEditProject(project: Project) {
    this.dbService.setDocument('projects', project.id, project);
  }

  commitReorder() {
    for (let i = 0; i < this.projects.length; i++) {
      this.dbService.updateDocument('projects', this.projects[i].id, { 'order': i });
    }
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }

}
