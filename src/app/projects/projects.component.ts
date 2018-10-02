import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { DatabaseService } from '../shared/database.service';

@Component({
  selector: 'dm-projects',
  templateUrl: './projects.component.html',
  styleUrls: ['./projects.component.scss']
})
export class ProjectsComponent implements OnInit {

  projects: Observable<any[]>;
  viewingSingle = false;

  constructor(private dbService: DatabaseService) {

  }

  ngOnInit() {
    this.projects = this.dbService.fetchData('projects');
  }

}
