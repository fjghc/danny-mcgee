// Angular imports
import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

// Dependency imports
import { DragulaModule } from 'ng2-dragula';
import { DeviceDetectorModule } from 'ngx-device-detector';

// App imports
import { AppComponent } from './app.component';
import { AppRoutingModule } from './app-routing.module';
import { HomeComponent } from './pages/home/home.component';
import { ExperienceComponent } from './pages/experience/experience.component';
import { SkillsComponent } from './pages/skills/skills.component';
import { ProjectsModule } from './pages/projects/projects.module';
import { ContactComponent } from './pages/contact/contact.component';
import { ViewSourceComponent } from './pages/view-source/view-source.component';
import { SharedModule } from './shared/shared.module';
import { CoreModule } from './core/core.module';
import { FormComponentsModule } from './form-components/form-components.module';
import { DatabaseModule } from './database/database.module';
import { EditorModule } from './editor/editor.module';

// Module config
@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    ExperienceComponent,
    SkillsComponent,
    ContactComponent,
    ViewSourceComponent,
  ],
  imports: [
    BrowserModule,
    SharedModule,
    FormComponentsModule,
    CoreModule,
    DatabaseModule,
    AppRoutingModule,
    DragulaModule.forRoot(),
    DeviceDetectorModule.forRoot(),
    EditorModule,
    ProjectsModule,
  ],
  bootstrap: [AppComponent]
})
export class AppModule {}
