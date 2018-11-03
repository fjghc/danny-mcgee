import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './core/auth/login/login.component';
import { HomeComponent } from './pages/home/home.component';
import { ViewSourceComponent } from './pages/view-source/view-source.component';
import { ContactComponent } from './pages/contact/contact.component';
import { SkillsComponent } from './pages/skills/skills.component';
import { ExperienceComponent } from './pages/experience/experience.component';

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
];

@NgModule({
  imports: [RouterModule.forRoot(appRoutes)],
  exports: [RouterModule]
})
export class AppRoutingModule {}
