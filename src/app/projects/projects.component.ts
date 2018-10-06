import { Component, OnDestroy, OnInit } from '@angular/core';
import { Observable, Subscription } from 'rxjs';
import { Project } from './project.model';
import { ActivatedRoute, Router } from '@angular/router';
import { ProjectsService } from './projects.service';

@Component({
  selector: 'dm-projects',
  templateUrl: './projects.component.html',
  styleUrls: ['./projects.component.scss']
})
export class ProjectsComponent implements OnInit, OnDestroy {

  projects: Observable<any[]>;
  viewingSingle = false;
  subscription: Subscription;

  constructor(
    private projectsService: ProjectsService,
    private router: Router,
    private route: ActivatedRoute
  ) {}

  ngOnInit() {
    this.projects = this.projectsService.fetchProjects();
    this.subscription = this.projectsService.closeActiveProject.subscribe(
      () => {
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

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }

}
