// Angular imports
import { Injectable, OnDestroy } from '@angular/core';

// Dependency imports
import { BehaviorSubject, Observable, Subject, Subscription } from 'rxjs';

// App imports
import { DataHandler } from '../../database/data-handler.service';
import { Project } from './project.model';

// Component config
@Injectable({ providedIn: 'root' })
export class ProjectsService implements OnDestroy {

  // Data
  projectsObservable: Observable<Project[]>;
  projectsTemp: Project[];
  projects: Project[];

  // State
  editMode = new BehaviorSubject<boolean>(false);

  // Event Subjects
  viewProject = new Subject();
  closeActiveProject = new Subject();
  newProject = new Subject();
  saveChanges = new Subject();

  // Subs
  dbSub: Subscription;

  // Services
  constructor(private dataHandler: DataHandler) {}

  // Getters
  watchProjects(): Observable<Project[]> {
    // Sync this service's data with the database
    this.projectsObservable = this.dataHandler.watchCollection('projects') as Observable<Project[]>;

    this.dbSub = this.projectsObservable.subscribe(
      projects => this.projects = projects
    );

    // return the observable for outside subscription
    return this.projectsObservable;
  }

  getProjectsCopy(): Project[] {
    // make a copy of the projects in their current state and return them for editing
    this.projectsTemp = [];
    for (const project of this.projects) {
      this.projectsTemp.push({ ...project });
    }
    return this.projectsTemp;
  }

  getProject(id: string, projectsRef: 'temp' | 'db'): Project {
    try {
      for (const project of this.resolveProjectsRef(projectsRef)) {
        if (project.id === id) {
          return project;
        }
      }
      console.log(`ERROR: No project found with id ${id}`);
      return null;
    } catch {
      return null;
    }
  }

  // State manipulation
  toggleEditMode() {
    this.editMode.next(!this.editMode.getValue());
  }

  // Data manipulation
  setProjects(projects: Project[]) {
    this.projectsTemp = projects;
  }

  editProject(project: Project) {
    const index = this.indexOf(project.id, 'temp');
    if (index !== false) {
      this.projectsTemp[index] = project;
    }
  }

  addProject(project: Project) {
    this.projectsTemp.push(project);
  }

  commitChangesToDatabase() {
    // Dragula changes the order of the items in the array with drag-and-drop
    // Update the 'order' property of each project to match the new array order
    for (let i = 0; i < this.projectsTemp.length; i++) {
      this.projectsTemp[i].order = i;
    }

    // compare temp projects to database projects and update where necessary
    for (const project of this.projectsTemp) {
      const index = this.indexOf(project.id, 'db');

      if (index !== false) {
        // this project already exists
        if (this.areProjectsDifferent(project, this.projects[index])) {
          // this project is different than the one in the database
          this.dataHandler.updateDocument('projects', project.id, project);
        }
      } else {
        // this is a new project
        this.dataHandler.addDocument('projects', project.id, project);
      }
    }
  }

  // Helper functions
  indexOf(id: string, projectsRef: 'temp' | 'db'): number | false {
    // determine which array to search
    const projects = this.resolveProjectsRef(projectsRef);

    // search the array
    for (const project of projects) {
      if (project.id === id) {
        // if project is found, return the index
        return projects.indexOf(project);
      }
    }

    // if we get this far, there's no project matching that id
    return false;
  }

  areProjectsDifferent(a: Project, b: Project) {
    const aProps = Object.getOwnPropertyNames(a);
    const bProps = Object.getOwnPropertyNames(b);

    if (aProps.length !== bProps.length) {
      return true;
    }

    for (let i = 0; i < aProps.length; i++) {
      const propName = aProps[i];

      if (a[propName] !== b[propName]) {
        return true;
      }
    }

    return false;
  }

  resolveProjectsRef(ref: 'temp' | 'db'): Project[] {
    if (ref === 'temp') {
      return this.projectsTemp;
    }
    if (ref === 'db') {
      return this.projects;
    }
  }

  // Cleanup
  ngOnDestroy() {
    this.dbSub.unsubscribe();
  }

}
