import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { Project } from './project.model';
import { ActivatedRoute, Router } from '@angular/router';
import { ProjectsService } from './projects.service';

@Component({
  selector: 'dm-projects',
  templateUrl: './projects.component.html',
  styleUrls: ['./projects.component.scss']
})
export class ProjectsComponent implements OnInit {

  projects: Observable<any[]>;
  viewingSingle = false;

  constructor(
    private projectsService: ProjectsService,
    private router: Router,
    private route: ActivatedRoute
  ) {}

  ngOnInit() {
    this.projects = this.projectsService.fetchProjects();
    this.projectsService.closeActiveProject.subscribe(
      event => {
        this.onDismissModal();
      }
    );
  }

  onViewProject(project: Project) {
    this.viewingSingle = true;
    this.router.navigate([project.filesRef], { relativeTo: this.route });
  }

  onDismissModal() {
    this.viewingSingle = false;
    this.router.navigate(['projects']);
  }

}
