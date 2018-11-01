// Angular imports
import { Component, HostBinding, OnDestroy, OnInit, Renderer2 } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

// Dependency imports
import { Observable, Subscription } from 'rxjs';
import { faEllipsisV } from '@fortawesome/pro-light-svg-icons';

// App imports
import { Project } from './project.model';
import { AuthService } from '../../shared/auth.service';
import { ProjectsService } from './projects.service';

// Component config
@Component({
  selector: 'dm-projects',
  templateUrl: './projects.component.html',
  styleUrls: ['./projects.component.scss']
})
export class ProjectsComponent implements OnInit, OnDestroy {

  // Data
  projectsObservable: Observable<Project[]>;
  projects: Project[];
  icons = {
    drag: faEllipsisV
  };

  // State
  viewingSingle = false;
  @HostBinding('class.edit-mode') editMode: boolean;

  // Subs
  viewProjectSub: Subscription;
  closeProjectSub: Subscription;
  editModeSub: Subscription;
  newProjectSub: Subscription;
  saveChangesSub: Subscription;

  // Services
  constructor(
    public authService: AuthService,
    private projectsService: ProjectsService,
    private router: Router,
    private route: ActivatedRoute,
    private renderer: Renderer2
  ) {}

  // Init
  ngOnInit() {
    this.viewProjectSub = this.projectsService.viewProject.subscribe(
      () => this.viewingSingle = true
    );
    this.closeProjectSub = this.projectsService.closeActiveProject.subscribe(
      () => this.onDismissModal()
    );
    this.editModeSub = this.projectsService.editMode.subscribe(
      mode => this.onEditModeChange(mode)
    );
    this.newProjectSub = this.projectsService.newProject.subscribe(
      () => this.onNewProject()
    );
    this.saveChangesSub = this.projectsService.saveChanges.subscribe(
      () => this.onSaveChanges()
    );
  }

  // Events
  onViewProject(project: Project) {
    this.viewingSingle = true;
    this.router.navigate([project.id], { relativeTo: this.route });
    this.renderer.addClass(document.body, 'modal-open');
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
    this.renderer.removeClass(document.body, 'modal-open');
  }

  onEditModeChange(mode) {
    this.editMode = mode;
    if (mode) {
      // Create a temporary copy of the projects for editing
      this.projects = this.projectsService.getProjectsCopy();
    } else {
      // Get projects from database
      this.projectsObservable = this.projectsService.watchProjects();
    }
  }

  onSaveChanges() {
    this.projectsService.commitChangesToDatabase();
    this.projectsService.editMode.next(false);
  }

  onDrag() {
    this.projectsService.setProjects(this.projects);
  }

  // Cleanup
  ngOnDestroy() {
    this.viewProjectSub.unsubscribe();
    this.closeProjectSub.unsubscribe();
    this.editModeSub.unsubscribe();
    this.newProjectSub.unsubscribe();
    this.saveChangesSub.unsubscribe();
  }

}
