import { Component, forwardRef, Inject, Input, NgZone } from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';


import { BaseEditor } from './base-editor';
import { NG_MONACO_EDITOR_CONFIG, NgMonacoEditorConfig } from './config';
import { NgEditorModel } from './types';
import { fromEvent } from 'rxjs';

@Component({
  selector: 'dm-monaco-editor',
  template: '<div class="editor-container" #editorContainer></div>',
  styles: [`
    :host {
      display: block;
      height: 200px;
    }

    .editor-container {
      width: 100%;
      height: 98%;
    }
  `],
  providers: [{
    provide: NG_VALUE_ACCESSOR,
    useExisting: forwardRef(() => MonacoEditorComponent),
    multi: true
  }]
})
export class MonacoEditorComponent extends BaseEditor implements ControlValueAccessor {
  private _value = '';

  propagateChange = (_: any) => {};
  onTouched = () => {};

  @Input('model')
  set model(model: NgEditorModel) {
    this.options.model = model;
    if (this._editor) {
      this._editor.dispose();
      this.initMonaco(this.options);
    }
  }

  constructor(private zone: NgZone, @Inject(NG_MONACO_EDITOR_CONFIG) private editorConfig: NgMonacoEditorConfig) {
    super(editorConfig);
  }

  writeValue(value: any): void {
    this._value = value || '';
    // Fix for value change while dispose in process.
    setTimeout(() => {
      if (this._editor && !this.options.model) {
        this._editor.setValue(this._value);
      }
    });
  }

  registerOnChange(fn: any): void {
    this.propagateChange = fn;
  }

  registerOnTouched(fn: any): void {
    this.onTouched = fn;
  }

  protected initMonaco(options: any): void {

    const hasModel = !!options.model;

    if (hasModel) {
      console.log('has model');
      options.model = monaco.editor.createModel(options.model.value, options.model.language, options.model.uri);
      options.model.updateOptions({ tabSize: 2 });
    }

    this._editor = monaco.editor.create(this._editorContainer.nativeElement, options);

    if (!hasModel) {
      console.log('no model');
      this._editor.setValue(this._value);
    }

    this._editor.onDidChangeModelContent((e: any) => {
      const value = this._editor.getValue();
      this.propagateChange(value);
      // value is not propagated to parent when executing outside zone.
      this.zone.run(() => this._value = value);
    });

    this._editor.onDidBlurEditorWidget(() => {
      this.onTouched();
    });

    // refresh layout on resize event.
    if (this._windowResizeSubscription) {
      this._windowResizeSubscription.unsubscribe();
    }
    this._windowResizeSubscription = fromEvent(window, 'resize').subscribe(() => this._editor.layout());
    this.onInit.emit(this._editor);
  }

}
