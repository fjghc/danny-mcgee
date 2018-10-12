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
  projectsObservable: Observable<Project[]>;
  projects: Project[];
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
  saveChangesSub: Subscription;

  // Services
  constructor(
    public authService: AuthService,
    private projectsService: ProjectsService,
    private router: Router,
    private route: ActivatedRoute
  ) {}

  // Init
  ngOnInit() {
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

  onEditModeChange(mode) {
    this.editMode = mode;
    if (mode) {
      // Create a temporary copy of the projects for editing
      this.projects = this.projectsService.getProjectsTemp();
    } else {
      // Get projects from database
      this.projectsObservable = this.projectsService.watchProjects();
    }
  }

  onSaveChanges() {
    this.projectsService.commitChangesToDatabase();
    this.projectsService.editMode.next(false);
  }

  onDrag($event) {
    this.projectsService.setProjects(this.projects);
    console.log('Dragula event:', $event);
    console.log('Projects component projects:', this.projects);
    console.log('Projects Service projectsTemp:', this.projectsService.projectsTemp);
  }

  // Cleanup
  ngOnDestroy() {
    this.closeProjectSub.unsubscribe();
    this.editModeSub.unsubscribe();
    this.newProjectSub.unsubscribe();
  }

}
