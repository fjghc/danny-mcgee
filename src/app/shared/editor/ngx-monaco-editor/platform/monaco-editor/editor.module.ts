import { CommonModule } from '@angular/common';
import { ModuleWithProviders, NgModule } from '@angular/core';

import { NG_MONACO_EDITOR_CONFIG, NgMonacoEditorConfig } from './config';
import { MonacoEditorComponent } from './monaco-editor.component';

@NgModule({
  imports: [
    CommonModule
  ],
  declarations: [
    MonacoEditorComponent,
  ],
  exports: [
    MonacoEditorComponent,
  ]
})
export class MonacoEditorModule {
  public static forRoot(config: NgMonacoEditorConfig = {}): ModuleWithProviders {
    return {
      ngModule: MonacoEditorModule,
      providers: [
        { provide: NG_MONACO_EDITOR_CONFIG, useValue: config }
      ]
    };
  }
}
