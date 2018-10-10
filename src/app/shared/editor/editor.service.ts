// Angular imports
import { EventEmitter, Injectable, Output } from '@angular/core';

// Dependency imports
import { IconDefinition } from '@fortawesome/fontawesome-common-types';
import { faCaretDown, faCaretRight, faFolder, faFolderOpen } from '@fortawesome/pro-solid-svg-icons';
import { faCss3, faHtml5, faJs } from '@fortawesome/free-brands-svg-icons';

// App imports
import { DataHandler } from '../data-handler.service';
import { File } from './file.model';

// Service config
@Injectable()
export class EditorService {

  // Data
  icons = {
    folder: faFolder,
    folderOpen: faFolderOpen,
    angle: faCaretRight,
    angleOpen: faCaretDown,
    htmlmixed: faHtml5,
    css: faCss3,
    js: faJs
  };

  // Event emitters
  @Output() openFile = new EventEmitter<File>();
  @Output() fileTreeClick = new EventEmitter();

  // Services
  constructor(private dataHandler: DataHandler) {}

  // Getters
  getIconForType(type: string, open?: boolean): IconDefinition | IconDefinition[] {
    switch (type) {
      case 'folder':
        if (open) {
          return [this.icons.folderOpen, this.icons.angleOpen];
        } else {
          return [this.icons.folder, this.icons.angle];
        }

      case 'htmlmixed':
        return this.icons.htmlmixed;

      case 'css':
        return this.icons.css;

      case 'javascript':
        return this.icons.js;
    }
  }

  // Data manipulation
  setupFileContent(file: File) {
    if (!file.contents) {
      const contentPromise = new Promise<string>((resolve, reject) => {
        this.dataHandler.readFile(file.storageRef)
          .then(content => {
            // console.log('Content received:', content);
            resolve(content);
          })
          .catch(error => {
            // console.log('ERROR: MonacoFile could not be generated', error);
            reject(error);
          });
      });
      file.initialContent = contentPromise;
      file.contents = contentPromise;
    }
  }

}
