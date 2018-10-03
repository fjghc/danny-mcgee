import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { AngularFireModule } from '@angular/fire';
import { AngularFireAuthModule } from '@angular/fire/auth';
import { AngularFireDatabaseModule } from '@angular/fire/database';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { environment } from '../environments/environment';

import { AppComponent } from './app.component';
import { AppRoutingModule } from './app-routing.module';
import { LoginComponent } from './auth/login/login.component';
import { FormComponent } from './shared/form/form.component';
import { InputComponent } from './shared/form/input/input.component';
import { ProjectsComponent } from './projects/projects.component';
import { DropdownDirective } from './shared/dropdown.directive';
import { HomeComponent } from './home/home.component';
import { CheckboxComponent } from './shared/form/checkbox/checkbox.component';
import { NavbarComponent } from './shared/navbar/navbar.component';
import { LogoComponent } from './shared/logo/logo.component';
import { ProjectItemComponent } from './projects/project-item/project-item.component';
import { HeaderComponent } from './shared/header/header.component';
import { ProjectDetailComponent } from './projects/project-detail/project-detail.component';
import { MonacoEditorModule } from 'ngx-monaco-editor';

@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    FormComponent,
    InputComponent,
    ProjectsComponent,
    DropdownDirective,
    HomeComponent,
    CheckboxComponent,
    NavbarComponent,
    LogoComponent,
    ProjectItemComponent,
    HeaderComponent,
    ProjectDetailComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule,
    FontAwesomeModule,
    AppRoutingModule,
    AngularFireModule.initializeApp(environment.firebase),
    AngularFireAuthModule,
    AngularFireDatabaseModule,
    MonacoEditorModule.forRoot()
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule {}
