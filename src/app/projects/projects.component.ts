import { Component, OnInit } from '@angular/core';
// import { ProjectsService } from './projects.service';
import { Observable } from 'rxjs';
import { Project } from './project.model';
import { AngularFireDatabase } from '@angular/fire/database';

@Component({
  selector: 'dm-projects',
  templateUrl: './projects.component.html',
  styleUrls: ['./projects.component.scss']
})
export class ProjectsComponent implements OnInit {

  projects: Observable<any[]>;

  constructor(private db: AngularFireDatabase) {
    this.projects = db.list('projects').valueChanges();
  }

  ngOnInit() {}

}
