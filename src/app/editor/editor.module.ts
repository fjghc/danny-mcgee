// Angular imports
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';

// Dependency imports
import { CodemirrorModule } from '@ctrl/ngx-codemirror';
import { DragulaModule } from 'ng2-dragula';
import { PerfectScrollbarModule } from 'ngx-perfect-scrollbar';

// App imports
import { EditorService } from './editor.service';
import { EditorComponent } from './editor.component';
import { FiletreeComponent } from './filetree/filetree.component';
import { FileComponent } from './filetree/file/file.component';
import { SharedModule } from '../shared/shared.module';

@NgModule({
  declarations: [
    EditorComponent,
    FiletreeComponent,
    FileComponent,
  ],
  imports: [
    SharedModule,
    FormsModule,
    CodemirrorModule,
    DragulaModule,
    PerfectScrollbarModule
  ],
  exports: [
    EditorComponent
  ],
  providers: [EditorService]
})
export class EditorModule {}
