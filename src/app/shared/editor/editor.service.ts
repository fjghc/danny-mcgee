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
import { faCss3, faHtml5, faJs } from '@fortawesome/free-brands-svg-icons';

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
        newFolder: faFolderPlus,
        delete: faTrash
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
    console.log('watching files for project ' + projectId);

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
    return this.filesTemp;
  }

  getFile(path: string, filesRef: 'temp' | 'db') {
    for (const file of this.resolveFilesRef(filesRef)) {
      if (file.path === path) {
        return file;
      }
    }
  }

  // FIXME: Try to avoid using getter methods for property binding
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

  // FIXME: Try to avoid using getter methods for property binding
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

  /**
   * Creates a new file or folder either adjacent to or inside of the selected file/folder
   * @param isFolder Indicates the 'type' property of the created file
   * @param selectedFile The currently selected file in the filetree
   */
  createFileOrFolder(isFolder: boolean, selectedFile?: File) {
    let parent: File[];
    let path: string;

    if (selectedFile) {
      if (selectedFile.type === 'folder') {
        parent = selectedFile.contents as File[];
        path = selectedFile.path;
      } else {
        const parentFolder = this.findParentOfFile(selectedFile, this.filesTemp) as File;
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
    console.log('deleting file:', file);
    const parent = this.findParentOfFile(file, this.filesTemp);
    const parentArray = parent instanceof Array ? parent : parent.contents as File[];
    parentArray.splice(this.indexOf(file.path, parentArray), 1);
  }

  /**
   * Sort's the given file's parent folder (folders to the top, then alphabetical)
   */
  sortParentArrayOfFile(file: File) {
    // Find the parent array
    const parent = this.findParentOfFile(file, this.filesTemp);
    console.log('parent is:', parent);
    const parentArray = parent instanceof Array ? parent : parent.contents as File[];

    // Sort it
    parentArray.sort((a: File, b: File) => {
      // Make the comparison case insensitive
      const aName = a.name.toUpperCase();
      const bName = b.name.toUpperCase();

      // If both folders or both not folders, sort alphabetically
      if (a.type === 'folder' && b.type === 'folder' || a.type !== 'folder' && b.type !== 'folder') {
        console.log(`Sorting ${a.name} and ${b.name} alphabetically`);
        if (aName < bName) {
          console.log(`${a.name} < ${b.name}`);
          return -1;
        }
        if (aName > bName) {
          console.log(`${b.name} < ${a.name}`);
          return 1;
        }
        // Names are equal (this should never happen)
        console.log(`ERROR: Couldn't sort ${a.name} from ${b.name}!`);
        return 0;
      }

      // Otherwise, sort folders to the top
      if (a.type === 'folder' && b.type !== 'folder') {
        console.log(`Sorting ${a.name} to the top because it's a folder`);
        return -1;
      }
      if (a.type !== 'folder' && b.type === 'folder') {
        console.log(`Sorting ${b.name} to the top because it's a folder`);
        return 1;
      }

      // Names are equal (this should never happen)
      console.log(`ERROR: Couldn't sort ${a.name} from ${b.name}!`);
      return 0;
    });
  }


  // Helper functions

  /**
   * Returns the parent of a given file as either a file with type: folder, or an array of files
   * @param needle The file whose parent we're trying to find
   * @param haystack Can be a file with type: folder, an array of files, or an array of an array of files
   */
  private findParentOfFile(needle: File, haystack: File | File[] | File[][]): File | File[] {

    // Prepare the haystack(s)
    let arrayToSearch;
    let haystackOfHaystacks = false;
    let loopsToRun: number;

    if (haystack instanceof Array) {
      if (haystack[0] instanceof Array) {
        // this is an array of an array of files
        haystackOfHaystacks = true;
        arrayToSearch = haystack;
        loopsToRun = haystack.length;
      } else {
        // this is an array of files
        arrayToSearch = haystack;
        loopsToRun = 1;
      }
    } else {
      // this is just a folder
      arrayToSearch = haystack.contents as File[];
      loopsToRun = 1;
    }

    // Setup a fallback array of arrays
    const fallbackHaystacks: File[][] = [];

    // Start looping
    for (let i = 0; i < loopsToRun; i++) {

      let currentHaystack;
      if (haystackOfHaystacks) {
        // Search the array of the array
        currentHaystack = arrayToSearch[i];
      } else {
        // Search the array itself
        currentHaystack = arrayToSearch;
      }

      for (const hay of currentHaystack) {
        // Make the comparison
        if (hay === needle) {
          // It's a match! Return the current haystack
          return currentHaystack;
        } else if (hay.contents instanceof Array) {
          // No match, but this is a folder, so add it to the list of fallbacks
          fallbackHaystacks.push(hay.contents);
        }
      }
    }
    // Made it all the way through the haystack and didn't find the needle, so try the fallbacks
    return this.findParentOfFile(needle, fallbackHaystacks);
  }

  /**
   * Finds a file with the given path string and returns its index in the array
   * @param path The path to search for
   * @param files The array to search
   */
  private indexOf(path: string, files: File[]): number {
    // search the array
    for (const file of files) {
      if (file.path === path) {
        // if project is found, return the index
        return files.indexOf(file);
      }
    }
    // if we get this far, there's no project matching that id
    // return false;
  }

  private resolveFilesRef(ref: 'temp' | 'db'): File[] {
    if (ref === 'temp') {
      return this.filesTemp;
    }
    if (ref === 'db') {
      return this.files;
    }
  }

}
