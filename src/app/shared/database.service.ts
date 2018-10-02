import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { Project } from '../projects/project.model';
import { Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class DatabaseService {

  baseURL = environment.firebase.databaseURL;
  projectsURL = '/projects.json';
  usersURL = '/users.json';

  constructor(private httpClient: HttpClient) {}

  fetchProjects() {
    this.httpClient.get<Project[]>(this.baseURL + this.projectsURL)
      .subscribe(
        projects => projects
      );
  }

}
