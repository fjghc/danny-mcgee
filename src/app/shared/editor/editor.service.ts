// Angular imports
import { Injectable } from '@angular/core';

// Dependency imports
import { BehaviorSubject, Observable, Subject, Subscription } from 'rxjs';
import { IconDefinition } from '@fortawesome/fontawesome-common-types';
import { faCaretDown, faCaretRight, faFolder, faFolderOpen, faFilePlus, faFolderPlus } from '@fortawesome/pro-solid-svg-icons';
import { faCss3, faHtml5, faJs } from '@fortawesome/free-brands-svg-icons';
import { faFile } from '@fortawesome/pro-light-svg-icons';

// App imports
import { DataHandler } from '../data-handler.service';
import { createFile, File } from './file.model';

// Service config
@Injectable()
export class EditorService {

  // Data
    // Project
    projectId: string;

    // Files
    filesObservable: Observable<File[]>;
    filesTemp: File[];
    private files: File[];

    // Icons
    icons = {
      files: {
        folder: faFolder,
        folderOpen: faFolderOpen,
        angle: faCaretRight,
        angleOpen: faCaretDown,
        unknownFile: faFile,
        html: faHtml5,
        css: faCss3,
        js: faJs
      },
      ui: {
        newFile: faFilePlus,
        newFolder: faFolderPlus
      }
    };

  // State
  editMode = new BehaviorSubject<boolean>(false);

  // Event Subjects
  fileTreeClick = new Subject<File>();
  newFile = new Subject<File>();
  newFileCommitted = new Subject<File>();

  // Subs
  filesSub: Subscription;

  // Services
  constructor(private dataHandler: DataHandler) {}

  // Getters
  watchFiles(projectId: string): Observable<File[]> {
    this.projectId = projectId;

    // sync this service's files with the database
    this.filesObservable = this.dataHandler.watchList('filesMap/' + projectId) as Observable<File[]>;

    this.filesSub = this.filesObservable.subscribe(
      files => this.files = files,
      error => console.log(error)
    );

    // return the observable for outside subscription
    return this.filesObservable;
  }

  getFiles(): File[] {
    return this.files;
  }

  getFilesCopy(): File[] {
    // make a deep copy of the files in their current state and return them for editing
    this.filesTemp = JSON.parse(JSON.stringify(this.files));
    console.log('comparison:');
    console.log(this.files);
    console.log(this.filesTemp);
    return this.filesTemp;
  }

  getFile(path: string, filesRef: 'temp' | 'db') {
    for (const file of this.resolveFilesRef(filesRef)) {
      if (file.path === path) {
        return file;
      }
    }
  }

  getIconForType(type: string, open?: boolean): IconDefinition | IconDefinition[] {
    switch (type) {
      case 'folder':
        if (open) {
          return [this.icons.files.folderOpen, this.icons.files.angleOpen];
        } else {
          return [this.icons.files.folder, this.icons.files.angle];
        }

      case 'html':
        return this.icons.files.html;

      case 'css':
        return this.icons.files.css;

      case 'js':
        return this.icons.files.js;

      default:
        return this.icons.files.unknownFile;
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

  getFileExtension(filename: string): string {
    return filename.match(/\.[\w]+$/)[0].replace(/^./, '');
  }

  // Data manipulation
  setupFileContent(file: File) {
    if (!file.contents) {
      this.dataHandler.readFile(file.path)
        .then(content => {
          file.initialContent = content;
          file.contents = content;
        })
        .catch(error => {
          console.log('ERROR: Couldn\'t get content for file:', file, error);
        });
    }
  }

  createFileOrFolder(isFolder: boolean, selectedFile?: File) {
    let parent: File[];
    let path: string;

    if (selectedFile) {
      if (selectedFile.type === 'folder') {
        parent = selectedFile.contents as File[];
        path = selectedFile.path;
      } else {
        const parentFolder = this.findParentOfFile(selectedFile, this.filesTemp);
        parent = parentFolder.contents as File[];
        path = parentFolder.path;
      }
    } else {
      path = this.projectId + '/';
      parent = this.filesTemp;
    }
    const newFile = createFile(
      '',
      isFolder ? 'folder' : null,
      isFolder ? [] : null,
      null,
      path
    );
    parent.push(newFile);
    setTimeout(() => this.newFile.next(newFile));
  }

  deleteFile(file: File) {

  }

  // Helper functions
  resolveFilesRef(ref: 'temp' | 'db'): File[] {
    if (ref === 'temp') {
      return this.filesTemp;
    }
    if (ref === 'db') {
      return this.files;
    }
  }

  findParentOfFile(needle: File, haystack: File | File[]): File {
    const haystackContents = haystack instanceof Array ? haystack : haystack.contents as File[];

    for (const hay of haystackContents) {
      if (hay === needle) {
        return haystack as File;
      } else if (hay.contents instanceof Array) {
        return this.findParentOfFile(needle, hay);
      }
    }
  }

}
