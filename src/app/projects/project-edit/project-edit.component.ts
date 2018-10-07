// Angular imports
import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';

// Dependency imports
import { Subscription } from 'rxjs';

// App imports
import { Project, createProject } from '../project.model';
import { ProjectsService } from '../projects.service';

// Component config
@Component({
  selector: 'dm-project-edit',
  host: { class: 'container' },
  templateUrl: './project-edit.component.html',
  styleUrls: ['./project-edit.component.scss']
})
export class ProjectEditComponent implements OnInit, OnDestroy {

  // Data
  project: Project;
  form: FormGroup;
  requiredValidator = [Validators.required];
  yearValidator = [
    Validators.required,
    Validators.pattern(/(\d){4}/g)
  ];
  urlValidator = [
    Validators.required,
    Validators.pattern(/[(http(s)?):\/\/(www\.)?a-zA-Z0-9@:%._\+~#=]{2,256}\.[a-z]{2,6}\b([-a-zA-Z0-9@:%_\+.~#?&//=]*)/i)
  ];
  @ViewChild('needsRefresh') needsRefreshComponent;
  @ViewChild('personal') personalComponent;

  // State
  newProject = false;

  // Subs
  routeSub: Subscription;

  // Services
  constructor(
    private projectsService: ProjectsService,
    private route: ActivatedRoute
  ) { }

  // Init
  ngOnInit() {
    // Initialize the form
    this.form = new FormGroup({});

    // Find out if we're editing an existing project
    this.routeSub = this.route.params.subscribe(
      params => {
        if (params['path']) {
          // We're editing a project that already exists
          this.project = this.projectsService.getProject(params['path'], 'temp');

          // Set the form values
          setTimeout(() => {
            this.form.patchValue(this.project);

            // Update the checkbox classes if necessary
            if (this.project.needsRefresh) {
              this.needsRefreshComponent.onChanged();
            }
            if (this.project.personal) {
              this.personalComponent.onChanged();
            }
          });
        } else {
          // This is a new project
          this.project = createProject();
          this.newProject = true;
        }
      }
    );
  }

  // Events
  onSubmit() {
    const formValue = this.form.value;

    this.project.name = formValue.name;
    this.project.year = formValue.year;
    this.project.url = formValue.url;
    this.project.imageFormat = formValue.imageFormat;
    this.project.needsRefresh = formValue.needsRefresh === true;
    this.project.personal = formValue.personal === true;

    if (this.newProject) {
      this.project.id = formValue.id;
      this.project.order = this.projectsService.projectsTemp.length;
      this.projectsService.addProject(this.project);
    } else {
      this.projectsService.editProject(this.project);
    }
    this.projectsService.closeActiveProject.emit();
  }

  // Cleanup
  ngOnDestroy() {
    this.routeSub.unsubscribe();
  }

}
