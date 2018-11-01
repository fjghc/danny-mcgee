import { NgModule } from '@angular/core';
import { InputComponent } from './input/input.component';
import { CheckboxComponent } from './checkbox/checkbox.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { SharedModule } from '../shared/shared.module';
import { TextareaAutosizeModule } from 'ngx-textarea-autosize';

@NgModule({
  declarations: [
    InputComponent,
    CheckboxComponent,
  ],
  imports: [
    SharedModule,
    FormsModule,
    ReactiveFormsModule,
    TextareaAutosizeModule,
  ],
  exports: [
    FormsModule,
    ReactiveFormsModule,
    InputComponent,
    CheckboxComponent,
    TextareaAutosizeModule
  ]
})
export class FormComponentsModule {}
