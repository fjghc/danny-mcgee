// Angular imports
import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';

// Dependency imports
import { AngularFireModule } from '@angular/fire';
import { AngularFireAuthModule } from '@angular/fire/auth';
import { AngularFirestoreModule } from '@angular/fire/firestore';
import { AngularFireDatabaseModule } from '@angular/fire/database';
import { AngularFireStorageModule } from '@angular/fire/storage';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { DragulaModule } from 'ng2-dragula';
import { CovalentCodeEditorModule } from '@covalent/code-editor';

// App imports
import { environment } from '../environments/environment';
import { AppComponent } from './app.component';
import { AppRoutingModule } from './app-routing.module';
import { LoginComponent } from './auth/login/login.component';
import { FormComponent } from './shared/form/form.component';
import { InputComponent } from './shared/form/input/input.component';
import { DropdownDirective } from './shared/dropdown.directive';
import { CheckboxComponent } from './shared/form/checkbox/checkbox.component';
import { NavbarComponent } from './shared/navbar/navbar.component';
import { LogoComponent } from './shared/logo/logo.component';
import { HeaderComponent } from './shared/header/header.component';
import { ProjectsComponent } from './projects/projects.component';
import { HomeComponent } from './home/home.component';
import { ProjectItemComponent } from './projects/project-item/project-item.component';
import { ProjectDetailComponent } from './projects/project-detail/project-detail.component';
import { ProjectEditComponent } from './projects/project-edit/project-edit.component';
import { EditorComponent } from './shared/editor/editor.component';
import { FiletreeComponent } from './shared/editor/filetree/filetree.component';
import { FileComponent } from './shared/editor/filetree/file/file.component';
import { LoadingComponent } from './shared/loading/loading.component';

// Module config
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
    ProjectDetailComponent,
    ProjectEditComponent,
    EditorComponent,
    FiletreeComponent,
    FileComponent,
    LoadingComponent
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
    AngularFirestoreModule,
    AngularFireDatabaseModule,
    AngularFireStorageModule,
    DragulaModule.forRoot(),
    CovalentCodeEditorModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule {}
