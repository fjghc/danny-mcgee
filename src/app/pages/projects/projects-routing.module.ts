import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ProjectsComponent } from './projects.component';
import { ProjectEditComponent } from './project-edit/project-edit.component';
import { ProjectDetailComponent } from './project-detail/project-detail.component';

const projectsRoutes: Routes = [
  {
    path: 'projects',
    component: ProjectsComponent,
    children: [
      {
        path: 'new',
        component: ProjectEditComponent
      },
      {
        path: 'edit/:path',
        component: ProjectEditComponent
      },
      {
        path: ':path',
        component: ProjectDetailComponent
      }
    ]
  },
];

@NgModule({
  imports: [
    RouterModule.forChild(projectsRoutes)
  ],
  exports: [
    RouterModule
  ]
})
export class ProjectsRoutingModule {}
