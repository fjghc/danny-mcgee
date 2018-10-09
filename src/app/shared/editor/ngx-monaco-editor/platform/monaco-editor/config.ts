import { InjectionToken } from '@angular/core';

export const NG_MONACO_EDITOR_CONFIG = new InjectionToken('NG_MONACO_EDITOR_CONFIG');

export interface NgMonacoEditorConfig {
  baseUrl?: string;
  defaultOptions?: { [key: string]: any; };
  onMonacoLoad?: Function;
}
