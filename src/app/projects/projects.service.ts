// Angular imports
import { EventEmitter, Injectable, OnDestroy, Output } from '@angular/core';

// Dependency imports
import { BehaviorSubject, Observable, Subscription } from 'rxjs';

// App imports
import { DatabaseService } from '../shared/database.service';
import { Project } from './project.model';

// Component config
@Injectable({ providedIn: 'root' })
export class ProjectsService implements OnDestroy {

  // Data
  projectsObservable: Observable<Project[]>;
  projects: Project[];

  // Event emitters
  @Output() closeActiveProject = new EventEmitter();
  @Output() newProject = new EventEmitter();

  // State
  editMode = new BehaviorSubject<boolean>(false);
  orderChanged = new BehaviorSubject<boolean>(false);

  // Subs
  dbSub: Subscription;

  // Services
  constructor(private dbService: DatabaseService) {}

  // Getters
  fetchProjects(): Observable<Project[]> {
    // Sync this service's data with the database
    this.projectsObservable = this.dbService.fetchCollection('projects') as Observable<Project[]>;

    this.dbSub = this.projectsObservable.subscribe(
      projects => {
        this.projects = projects;
      }
    );

    // return the observable for outside subscriptions
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

  // State manipulation
  toggleEditMode() {
    this.editMode.next(!this.editMode.getValue());
  }

  // Data manipulation
  addOrEditProject(project: Project) {
    this.dbService.setDocument('projects', project.id, project);
  }

  commitReorder() {
    for (let i = 0; i < this.projects.length; i++) {
      this.dbService.updateDocument('projects', this.projects[i].id, { 'order': i });
    }
  }

  // Helper functions
  indexOf(id: string): number {
    for (const project of this.projects) {
      if (project.id === id) {
        return this.projects.indexOf(project);
      }
    }
  }

  // Cleanup
  ngOnDestroy() {
    this.dbSub.unsubscribe();
  }

}
