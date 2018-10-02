import { Injectable } from '@angular/core';

import { Observable } from 'rxjs';
import { AngularFireDatabase } from '@angular/fire/database';

import { Project } from './project.model';

@Injectable({ providedIn: 'root' })
export class ProjectsService {

  projects: Observable<any[]>;
  localProjects: Project[] = [];

  constructor(private db: AngularFireDatabase) {
    // this.projects = this.db.list('projects').valueChanges();
  }

  fetchProjects() {
    return this.db.list('projects.json').valueChanges();
  }

}
