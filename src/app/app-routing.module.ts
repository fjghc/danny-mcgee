import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './core/login/login.component';
import { HomeComponent } from './pages/home/home.component';
import { ViewSourceComponent } from './pages/view-source/view-source.component';
import { ContactComponent } from './pages/contact/contact.component';
import { SkillsComponent } from './pages/skills/skills.component';
import { ProjectsComponent } from './pages/projects/projects.component';
import { ProjectEditComponent } from './pages/projects/project-edit/project-edit.component';
import { ProjectDetailComponent } from './pages/projects/project-detail/project-detail.component';
import { ExperienceComponent } from './pages/experience/experience.component';
import { NotFoundComponent } from './pages/not-found/not-found.component';

const appRoutes: Routes = [
  {
    path: '',
    component: HomeComponent,
    pathMatch: 'full',
    data: { state: 'home' }
  },
  {
    path: 'experience',
    component: ExperienceComponent,
    data: { state: 'experience' }
  },
  {
    path: 'skills',
    component: SkillsComponent,
    data: { state: 'skills' }
  },
  {
    path: 'projects',
    component: ProjectsComponent,
    data: { state: 'projects' },
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
  {
    path: 'contact',
    component: ContactComponent,
    data: { state: 'contact' }
  },
  {
    path: 'view-source',
    component: ViewSourceComponent,
    data: { state: 'view-source' }
  },
  {
    path: 'login',
    component: LoginComponent,
    data: { state: 'login' }
  },
  {
    path: '404',
    component: NotFoundComponent,
    data: { state: 'not-found' }
  },
  {
    path: '**',
    redirectTo: '404'
  }
];

@NgModule({
  imports: [RouterModule.forRoot(appRoutes)],
  exports: [RouterModule]
})
export class AppRoutingModule {}
