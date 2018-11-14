// Angular imports
import { Injectable } from '@angular/core';

// Dependency imports
import { BehaviorSubject, Observable, Subject, Subscription } from 'rxjs';
import { IconDefinition } from '@fortawesome/fontawesome-common-types';
import {
  faCaretDown,
  faCaretRight,
  faFolder,
  faFolderOpen,
  faFile,
  faFilePlus,
  faFolderPlus,
  faTrash
} from '@fortawesome/pro-solid-svg-icons';
import { faAngular, faCss3, faHtml5, faJs, faLess, faPhp, faSass } from '@fortawesome/free-brands-svg-icons';

// App imports
import { DataHandler } from '../database/data-handler.service';
import { createFile, EditorFile } from './file.model';
import { DmIconDefinition } from '../shared/icon-definitions/icon-definition.model';
import { dmTypeScript } from '../shared/icon-definitions';

// Service config
@Injectable()
export class EditorService {

  // Data
    // Project
    projectId: string;

    // Files
    filesObservable: Observable<EditorFile[]>;
    filesTemp: EditorFile[];
    private files: EditorFile[];
    filesToDelete: EditorFile[];

    // Icons
    icons = {
      files: {
        folder: faFolder,
        folderOpen: faFolderOpen,
        angle: faCaretRight,
        angleOpen: faCaretDown,
        angular: faAngular,
        unknownFile: faFile,
        html: faHtml5,
        css: faCss3,
        less: faLess,
        sass: faSass,
        js: faJs,
        ts: dmTypeScript,
        php: faPhp
      },
      ui: {
        newFile: faFilePlus,
        newFolder: faFolderPlus,
        delete: faTrash
      }
    };

  // State
  editMode = new BehaviorSubject<boolean>(false);

  // Event Subjects
  fileTreeClick = new Subject<EditorFile>();
  newFile = new Subject<EditorFile>();
  newFileCommitted = new Subject<EditorFile>();

  // Subs
  filesSub: Subscription;

  // Services
  constructor(private dataHandler: DataHandler) {}


  // Getters

  watchFiles(projectId: string): Observable<EditorFile[]> {
    this.projectId = projectId;

    // sync this service's files with the database
    this.filesObservable = this.dataHandler.watchList('filesMap/' + projectId) as Observable<EditorFile[]>;

    this.filesSub = this.filesObservable.subscribe(
      files => this.files = files,
      error => console.log(error)
    );

    // return the observable for outside subscription
    return this.filesObservable;
  }

  getFilesCopy(): EditorFile[] {
    // make a deep copy of the files in their current state and return them for editing
    this.filesTemp = JSON.parse(JSON.stringify(this.files));
    return this.filesTemp;
  }

  getIconForType(type: string, open?: boolean): IconDefinition | IconDefinition[] | DmIconDefinition {
    switch (type) {
      case 'folder':
        if (open) {
          return [this.icons.files.folderOpen, this.icons.files.angleOpen];
        } else {
          return [this.icons.files.folder, this.icons.files.angle];
        }
      case 'html':
        return this.icons.files.html;
      case 'php':
        return this.icons.files.php;
      case 'css':
        return this.icons.files.css;
      case 'sass':
      case 'scss':
        return this.icons.files.sass;
      case 'less':
        return this.icons.files.less;
      case 'js':
        return this.icons.files.js;
      case 'ts':
        return this.icons.files.ts;
      case 'ng-module':
      case 'ng-component':
      case 'ng-template':
      case 'ng-service':
      case 'ng-directive':
        return this.icons.files.angular;
      default:
        return this.icons.files.unknownFile;
    }
  }

  getModeForType(type: string): string {
    switch (type) {
      case 'html':
        return 'htmlmixed';
      case 'ng-template':
        return 'ngtemplate';
      case 'php':
        return 'php';
      case 'css':
        return 'css';
      case 'sass':
        return 'text/x-scss';
      case 'scss':
        return 'text/x-scss';
      case 'less':
        return 'text/x-less';
      case 'js':
        return 'javascript';
      case 'ts':
      case 'ng-module':
      case 'ng-component':
      case 'ng-service':
      case 'ng-directive':
        return 'application/typescript';
      default:
        return 'text/plain';
    }
  }

  getFileExtension(filename: string): string {
    return filename.match(/\.[\w]+$/)[0].replace(/^\./, '');
  }

  getFileType(filename: string): string {
    const extension = this.getFileExtension(filename);

    if (extension !== 'ts' && extension !== 'html') {
      return extension;
    }

    const _filename = filename.replace(/\.(ts|html)$/, '');

    let suffix;
    if (/\./g.test(_filename)) {
      suffix = this.getFileExtension(_filename);
    } else {
      return extension;
    }

    if (extension === 'ts') {
      switch (suffix) {
        case 'module':    return 'ng-module';
        case 'component': return 'ng-component';
        case 'service':   return 'ng-service';
        case 'directive': return 'ng-directive';
        default:          return 'ts';
      }
    } else {
      switch (suffix) {
        case 'component':
          return 'ng-template';
        default:
          return 'html';
      }
    }
  }


  // Data manipulation

  setupFileContent(file: EditorFile) {
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

  /**
   * Creates a new file or folder either adjacent to or inside of the selected file/folder
   * @param isFolder Indicates the 'type' property of the created file
   * @param selectedFile The currently selected file in the filetree
   */
  createFileOrFolder(isFolder: boolean, selectedFile?: EditorFile) {
    let parent: EditorFile[];
    let path: string;

    if (selectedFile) {
      if (selectedFile.type === 'folder') {
        if (!selectedFile.contents) {
          selectedFile.contents = [];
        }
        parent = selectedFile.contents as EditorFile[];
        path = selectedFile.path;
      } else {
        const parentFolder = this.findParentOfFile(selectedFile, this.filesTemp) as EditorFile;
        parent = parentFolder.contents as EditorFile[];
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

  deleteFile(file: EditorFile) {
    const parent = this.findParentOfFile(file, this.filesTemp);
    const parentArray = parent instanceof Array ? parent : parent.contents as EditorFile[];
    parentArray.splice(this.indexOf(file.path, parentArray), 1);
  }

  addFileToDeleteList(file: EditorFile) {
    if (!this.filesToDelete) {
      this.filesToDelete = [];
    }
    this.filesToDelete.push(file);
  }

  /**
   * Saves changes made in edit mode by:
   * - Deleting any files in the delete list from Firebase Storage
   * - Constructing File objects for any new or modified files
   * - Uploading them to Firebase Storage
   * - Updating the filesMap in Firebase Realtime Database
   */
  async commitChangesToDatabase() {

    // Get a clean, flat list of the files without the folders included
    const flatFilesArray = this.flattenFilesArray([this.filesTemp]);

    // Process the delete list
    if (this.filesToDelete) {
      for (const file of this.filesToDelete) {
        await this.dataHandler.deleteFileFromStorage(file.path)
          .then(response => console.log(response))
          .catch(error => {
            console.log('ERROR DELETING FILE:', error);
            return;
          });
      }
    }

    // Upload any new or modified files
    if (flatFilesArray) {
      for (const _file of flatFilesArray) {
        if (_file.isNewOrModified) {

          // construct the file for upload (NOTE: File() constructor doesn't work in Edge/IE)
          const mimeType = this.getMimeTypeForExt(this.getFileExtension(_file.name));
          const file = new File([_file.contents as string], _file.name, { type: mimeType });

          // upload the file
          await this.dataHandler.uploadFileToStorage(file, _file.path)
            .then(response => console.log(response))
            .catch(error => {
              console.log('ERROR UPLOADING FILE:', error);
              return;
            });
        }
      }
    }

    // Clean up the file map before uploading
    if (flatFilesArray) {
      for (const file of flatFilesArray) {
        delete file.contents;
        delete file.initialContent;
        delete file.isNewOrModified;
        delete file.icon;
      }
    }

    // Upload new filesMap to the Realtime Database
    await this.dataHandler.uploadFilesMapForProject(this.projectId, this.filesTemp)
      .then(() => console.log('filesMap updated!'))
      .catch(error => {
        console.log('ERROR UPLOADING FILESMAP: ' + error);
        return;
      });

    // Perform cleanup
    this.filesToDelete = null;
    this.filesTemp = null;

    // Turn off edit mode
    this.editMode.next(false);
  }

  /**
   * Sort's the given file's parent folder (folders to the top, then alphabetical)
   */
  sortParentArrayOfFile(file: EditorFile) {

    // Find the parent array
    const parent = this.findParentOfFile(file, this.filesTemp);
    const parentArray = parent instanceof Array ? parent : parent.contents as EditorFile[];

    // Sort it
    parentArray.sort((a: EditorFile, b: EditorFile) => {

      // Make the comparison case insensitive
      const aName = a.name.toUpperCase();
      const bName = b.name.toUpperCase();

      // If both folders or both not folders, sort alphabetically
      if (a.type === 'folder' && b.type === 'folder' || a.type !== 'folder' && b.type !== 'folder') {
        if (aName < bName) {
          return -1;
        }
        if (aName > bName) {
          return 1;
        }

        // Names are equal (this should never happen)
        console.log(`ERROR: Couldn't sort ${a.name} from ${b.name}!`);
        return 0;
      }

      // Otherwise, sort folders to the top
      if (a.type === 'folder' && b.type !== 'folder') {
        return -1;
      }
      if (a.type !== 'folder' && b.type === 'folder') {
        return 1;
      }

      // Names are equal (this should never happen)
      console.log(`ERROR: Couldn't sort ${a.name} from ${b.name}!`);
      return 0;
    });
  }


  // Helper functions

  /**
   * Returns the parent folder of a given file, or the root files array if it has no parent folder
   * @param needle The file whose parent we're trying to find
   * @param haystack A flat array of files to search
   */
  private findParentOfFile(needle: EditorFile, haystack: EditorFile[]): EditorFile | EditorFile[] {

    // Set up a list of fallbacks to check if we don't find a match on the first pass
    const fallbackHaystack: EditorFile[] = [];

    for (const hay of haystack) {
      if (hay === needle) {
        // We must be on the top level, so just return the haystack
        return haystack;
      } else if (hay.contents instanceof Array) {
        // hay is a folder, so search inside of it
        for (const _hay of hay.contents) {
          if (_hay === needle) {
            // found the match; hay is the parent folder
            return hay;
          } else if (_hay.contents instanceof Array) {
            // hay's child is not the match, but it is a folder, so add it to the fallback array
            fallbackHaystack.push(_hay);
          }
        }
      }
    }
    // Made it all the way through without finding the match, so try the fallbacks
    return this.findParentOfFile(needle, fallbackHaystack);
  }

  flattenFilesArray(source: EditorFile[][], _dest?: EditorFile[]): EditorFile[] {
    const arraysToFlatten: EditorFile[][] = [];
    const dest: EditorFile[] = _dest === undefined ? [] : _dest;

    for (const array of source) {
      for (const file of array) {
        if (file.contents instanceof Array) {
          arraysToFlatten.push(file.contents);
        } else {
          dest.push(file);
        }
      }
    }

    if (arraysToFlatten.length > 0) {
      return this.flattenFilesArray(arraysToFlatten, dest);
    } else {
      return dest;
    }
  }

  getMimeTypeForExt(extension: string): string {
    switch (extension) {
      case 'bin':
        return 'application/octet-stream';
      case 'csh':
        return 'application/x-csh';
      case 'css':
        return 'text/css';
      case 'csv':
        return 'text/csv';
      case 'es':
        return 'application/ecmascript';
      case 'htm':
        return 'text/html';
      case 'html':
        return 'text/html';
      case 'js':
        return 'application/javascript';
      case 'json':
        return 'application/json';
      case 'less':
        return 'text/x-less';
      case 'php':
        return 'application/x-httpd-php';
      case 'scss':
        return 'text/x-sass';
      case 'sh':
        return 'application/x-sh';
      case 'svg':
        return 'image/svg+xml';
      case 'ts':
        return 'application/typescript';
      case 'txt':
        return 'text/plain';
      case 'xhtml':
        return 'application/xhtml+xml';
      case 'xml':
        return 'application/xml';
      default:
        return 'text/plain';
    }
  }

  private indexOf(path: string, files: EditorFile[]): number {
    for (const file of files) {
      if (file.path === path) {
        return files.indexOf(file);
      }
    }
  }

}
