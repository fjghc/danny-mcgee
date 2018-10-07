// Angular imports
import { Component, HostBinding, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

// Dependency imports
import { Observable, Subscription } from 'rxjs';
import { faEllipsisV } from '@fortawesome/pro-light-svg-icons';

// App imports
import { Project } from './project.model';
import { AuthService } from '../auth/auth.service';
import { ProjectsService } from './projects.service';

// Component config
@Component({
  selector: 'dm-projects',
  templateUrl: './projects.component.html',
  styleUrls: ['./projects.component.scss']
})
export class ProjectsComponent implements OnInit, OnDestroy {

  // Data
  projects: Observable<Project[]>;
  icons = {
    drag: faEllipsisV
  };

  // State
  viewingSingle = false;
  @HostBinding('class.edit-mode') editMode: boolean;

  // Subs
  closeProjectSub: Subscription;
  editModeSub: Subscription;
  newProjectSub: Subscription;

  // Services
  constructor(
    public authService: AuthService,
    private projectsService: ProjectsService,
    private router: Router,
    private route: ActivatedRoute
  ) {}

  // Init
  ngOnInit() {
    this.projects = this.projectsService.fetchProjects();

    this.closeProjectSub = this.projectsService.closeActiveProject.subscribe(
      () => this.onDismissModal()
    );
    this.editModeSub = this.projectsService.editMode.subscribe(
      value => this.editMode = value
    );
    this.newProjectSub = this.projectsService.newProject.subscribe(
      () => this.onNewProject()
    );
  }

  // Events
  onViewProject(project: Project) {
    this.viewingSingle = true;
    this.router.navigate([project.id], { relativeTo: this.route });
  }

  onNewProject() {
    this.projectsService.editMode.next(true);
    this.viewingSingle = true;
    this.router.navigate(['new'], { relativeTo: this.route });
  }

  onEditProject(project: Project) {
    this.viewingSingle = true;
    this.router.navigate(['edit', project.id], { relativeTo: this.route });
  }

  onDismissModal() {
    this.viewingSingle = false;
    this.router.navigate(['projects']);
  }

  // Cleanup
  ngOnDestroy() {
    this.closeProjectSub.unsubscribe();
    this.editModeSub.unsubscribe();
    this.newProjectSub.unsubscribe();
  }

}
