// Angular imports
import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';

// Dependency imports
import { Subscription } from 'rxjs';

// App imports
import { Project, createProject } from '../project.model';
import { ProjectsService } from '../projects.service';

@Component({
  selector: 'dm-project-edit',
  templateUrl: './project-edit.component.html',
  styleUrls: ['./project-edit.component.scss']
})
export class ProjectEditComponent implements OnInit, OnDestroy {

  project: Project;
  form: FormGroup;
  requiredValidator = [Validators.required];
  yearValidator = [Validators.required, Validators.pattern('\b(\d){4}\b')];
  urlValidator = [
    Validators.required,
    Validators.pattern('[(http(s)?):\\/\\/(www\\.)?a-zA-Z0-9@:%._\\+~#=]{2,256}\\.[a-z]{2,6}\\b([-a-zA-Z0-9@:%_\\+.~#?&//=]*)')
  ];
  subscription: Subscription;
  @ViewChild('needsRefresh') needsRefreshComponent;

  constructor(
    private projectsService: ProjectsService,
    private route: ActivatedRoute
  ) { }

  ngOnInit() {
    // Initialize the form
    this.form = new FormGroup({});

    // Find out if we're editing an existing project
    this.subscription = this.route.params.subscribe(
      params => {
        if (params['path']) {
          // We're editing a project that already exists
          this.project = this.projectsService.getProject(params['path']);

          // Set the form values
          setTimeout(() => {
            this.form.patchValue(this.project);

            // Update the checkbox class if necessary
            if (this.project.needsRefresh) {
              this.needsRefreshComponent.onChanged();
            }
          });
        } else {
          // This is a new project
          this.project = createProject();
        }
      }
    );
  }

  onSubmit() {
    console.log(this.form.value);
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }

}
