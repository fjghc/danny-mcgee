import { Component, HostBinding, OnDestroy, OnInit } from '@angular/core';
import { Observable, Subscription } from 'rxjs';
import { Project } from './project.model';
import { ActivatedRoute, Router } from '@angular/router';
import { ProjectsService } from './projects.service';
import { AuthService } from '../auth/auth.service';

@Component({
  selector: 'dm-projects',
  templateUrl: './projects.component.html',
  styleUrls: ['./projects.component.scss']
})
export class ProjectsComponent implements OnInit, OnDestroy {

  projects: Observable<Project[]>;
  viewingSingle = false;
  closeProjectSub: Subscription;
  @HostBinding('class.edit-mode') editMode: boolean;

  constructor(
    public authService: AuthService,
    private projectsService: ProjectsService,
    private router: Router,
    private route: ActivatedRoute
  ) {}

  ngOnInit() {
    this.projects = this.projectsService.fetchProjects();

    this.closeProjectSub = this.projectsService.closeActiveProject.subscribe(
      () => {
        this.onDismissModal();
      }
    );

    this.projectsService.editMode.subscribe(
      value => {
        this.editMode = value;
      }
    );
  }

  onViewProject(project: Project) {
    this.viewingSingle = true;
    this.router.navigate([project.id], { relativeTo: this.route });
  }

  onEditProject(project: Project) {
    this.viewingSingle = true;
    this.router.navigate(['edit', project.id], { relativeTo: this.route });
  }

  onDismissModal() {
    this.viewingSingle = false;
    this.router.navigate(['projects']);
  }

  ngOnDestroy() {
    this.closeProjectSub.unsubscribe();
  }

}
