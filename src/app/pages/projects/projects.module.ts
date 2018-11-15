import { NgModule } from '@angular/core';
import { ProjectsComponent } from './projects.component';
import { ProjectItemComponent } from './project-item/project-item.component';
import { ProjectDetailComponent } from './project-detail/project-detail.component';
import { ProjectEditComponent } from './project-edit/project-edit.component';
import { SharedModule } from '../../shared/shared.module';
import { DragulaModule } from 'ng2-dragula';
import { RouterModule } from '@angular/router';
import { EditorModule } from '../../editor/editor.module';
import { FormComponentsModule } from '../../form-components/form-components.module';

@NgModule({
  declarations: [
    ProjectsComponent,
    ProjectItemComponent,
    ProjectDetailComponent,
    ProjectEditComponent,
  ],
  imports: [
    SharedModule,
    FormComponentsModule,
    RouterModule,
    DragulaModule,
    EditorModule,
  ]
})
export class ProjectsModule {}
