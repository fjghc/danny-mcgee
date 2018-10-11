// Angular imports
import { EventEmitter, Injectable, Output } from '@angular/core';

// Dependency imports
import { IconDefinition } from '@fortawesome/fontawesome-common-types';
import { faCaretDown, faCaretRight, faFolder, faFolderOpen, faFile, faFolderPlus } from '@fortawesome/free-solid-svg-icons';
import { faCss3, faHtml5, faJs } from '@fortawesome/free-brands-svg-icons';

// App imports
import { DataHandler } from '../data-handler.service';
import { File } from './file.model';

// Service config
@Injectable()
export class EditorService {

  // Data
  icons = {
    files: {
      folder: faFolder,
      folderOpen: faFolderOpen,
      angle: faCaretRight,
      angleOpen: faCaretDown,
      html: faHtml5,
      css: faCss3,
      js: faJs
    },
    ui: {
      newFile: faFile,
      newFolder: faFolderPlus
    }
  };

  // Event emitters
  @Output() fileTreeClick = new EventEmitter<File>();
  @Output() newFile = new EventEmitter<File>();

  // Services
  constructor(private dataHandler: DataHandler) {}

  // Getters
  getIconForType(type: string, open?: boolean): IconDefinition | IconDefinition[] {
    switch (type) {
      case 'folder':
        if (open) {
          return [this.icons.files.folderOpen, this.icons.files.angleOpen] as IconDefinition[];
        } else {
          return [this.icons.files.folder, this.icons.files.angle] as IconDefinition[];
        }

      case 'html':
        return this.icons.files.html;

      case 'css':
        return this.icons.files.css;

      case 'js':
        return this.icons.files.js;
    }
  }

  getModeForType(type: string): string {
    switch (type) {
      case 'html':
        return 'htmlmixed';

      case 'css':
        return 'css';

      case 'js':
        return 'javascript';

      case 'ts':
        return 'application/typescript';

      default:
        console.log('Mode not found for type ' + type);
        break;
    }
  }

  getFiles(projectId: string): Promise<File[]> {
    return this.dataHandler.getList('filesMap/' + projectId) as Promise<File[]>;
  }

  // Data manipulation
  setupFileContent(file: File) {
    if (!file.contents) {
      const contentPromise = new Promise<string>((resolve, reject) => {
        this.dataHandler.readFile(file.path)
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
