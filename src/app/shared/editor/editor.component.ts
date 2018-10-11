// Angular imports
import { Component, HostListener, Input, OnDestroy, OnInit } from '@angular/core';

// Dependency imports
import { Subscription } from 'rxjs';
import { faCode, faEllipsisV, faTimes } from '@fortawesome/pro-light-svg-icons';

// CodeMirror
// Languages
import './languages/javascript';
import './languages/htmlmixed';
import 'codemirror/mode/css/css';
import 'codemirror/mode/sass/sass';

// Addons
import 'codemirror/addon/selection/active-line';
import 'codemirror/addon/edit/closebrackets';
import 'codemirror/addon/edit/closetag';
import 'codemirror/addon/edit/matchtags';
import 'codemirror/addon/scroll/simplescrollbars';

// App imports
import { File } from './file.model';
import { Tab, createTab } from './tab.model';
import { EditorService } from './editor.service';
import { AuthService } from '../../auth/auth.service';
import { mergeAnalyzedFiles } from '@angular/compiler';
import { DataHandler } from '../data-handler.service';

// Component config
@Component({
  selector: 'dm-editor',
  templateUrl: './editor.component.html',
  styleUrls: ['./editor.component.scss'],
  providers: [EditorService]
})
export class EditorComponent implements OnInit, OnDestroy {

  // Data
  // @Input() files: File[];
  @Input() storageRef: string;
  files: File[];
  tabs: Tab[] = [];
  icons = {
    close: faTimes,
    splash: faCode,
    resizer: faEllipsisV
  };

  // State
  activeTab: Tab;
  justOpenedFile: File;
  selectedFile: File;
  sidebarWidth = 300;
  sidebarStartingWidth: number;
  resizing = false;
  resizeStartPos: number;

  // Subs
  fileTreeClickSub: Subscription;

  // Services
  constructor(
    public editorService: EditorService,
    public authService: AuthService
  ) {}

  // Init
  ngOnInit() {
    this.fileTreeClickSub = this.editorService.fileTreeClick.subscribe(
      file => {
        if (file) {
          this.onFileTreeClick(file);
        } else {
          this.selectedFile = null;
        }
      }
    );
    this.editorService.getFiles(this.storageRef)
      .then(files => this.files = files)
      .catch(error => console.log(error));
  }

  // Events
  onNewFile(isFolder = false) {
    let parent: File[];
    let path: string;

    if (this.selectedFile) {
      if (this.selectedFile.type === 'folder') {
        parent = this.selectedFile.contents as File[];
        path = this.selectedFile.path;
      } else {
        const parentFile = this.findFileParent(this.selectedFile);
        parent = parentFile.contents as File[];
        path = parentFile.path;
      }
    } else {
      path = this.storageRef + '/';
      parent = this.files;
    }
    const newFile = new File(
      '',
      isFolder ? 'folder' : null,
      [],
      null,
      path
    );
    parent.push(newFile);
    this.editorService.newFile.next(newFile);
  }

  onFileTreeClick(file: File) {
    this.selectedFile = file;

    // Don't open folders as tabs
    if (file.type === 'folder') {
      return;
    }

    // If this is is a double click, make the temp tab permanent
    if (file === this.justOpenedFile) {
      for (const tab of this.tabs) {
        if (tab.file === file) {
          tab.type = 'perm';
          return;
        }
      }
    }

    // Set this as the just-opened file to detect for double clicks
    this.justOpenedFile = file;

    // If this file is already open in a tab, make it active
    for (const tab of this.tabs) {
      if (file === tab.file) {
        this.activeTab = tab;
        return;
      }
    }

    // If we've made it this far, this file hasn't been opened yet
    // Set up the file contents
    this.editorService.setupFileContent(file);

    // If there's already a temp tab open, replace its file with this one and make it active
    for (const tab of this.tabs) {
      if (tab.type === 'temp') {
        tab.file = file;
        this.activeTab = tab;
        return;
      }
    }

    // Create a new tab and make it active
    this.tabs.push(createTab('temp', file));
    this.activeTab = this.tabs[this.tabs.length - 1];

    // Set a timeout to watch for double clicks
    setTimeout(() => {
      this.justOpenedFile = null;
    }, 250);
  }

  onSetActive(tab: Tab) {
    this.activeTab = tab;
  }

  onCloseTab(tab: Tab) {
    for (let i = 0; i < this.tabs.length; i++) {

      // Find the array index of the requested tab
      if (this.tabs[i] === tab) {

        // If this is the active tab, set a flag for later use
        let needsNewActiveTab = false;
        if (this.activeTab === this.tabs[i]) {
          needsNewActiveTab = true;
        }

        // Confirm before closing if the file has been modified
        if (this.tabs[i].file.contents !== this.tabs[i].file.initialContent) {
          if (!confirm('Close this file? Unsaved changes will be lost!')) {
            return;
          }
        }

        // Remove the tab from the array
        this.tabs.splice(i, 1);

        // If this was the active tab and there are other tabs available...
        if (this.tabs.length && needsNewActiveTab) {

          // set a new active tab (either the one immediately before this one, or the first in the array)
          this.activeTab = i === 0 ? this.tabs[0] : this.tabs[i - 1];
        }
      }
    }
  }

  onEditorChange($event, tab: Tab) {
    tab.file.contents = new Promise(resolve => resolve($event));
    if (tab.type === 'temp') {
      tab.type = 'perm';
    }
  }

  // Simple file tree resizing
  onResizeStart($event: MouseEvent) {
    if ($event.button === 0) {
      this.resizing = true;
      $event.stopPropagation();
      $event.preventDefault();

      this.sidebarStartingWidth = this.sidebarWidth;
      this.resizeStartPos = $event.clientX;
    }
  }

  @HostListener('document:mouseup')
  @HostListener('document:mouseleave')
  onResizeEnd() {
    if (this.resizing) {
      this.resizing = false;
    }
  }

  @HostListener('document:mousemove', ['$event'])
  onResizeMove($event: MouseEvent) {
    if (this.resizing) {
      // TODO Generate the max sidebar width dynamically depending on viewport size
      this.sidebarWidth = Math.min(this.sidebarStartingWidth + ($event.clientX - this.resizeStartPos), 600);
    }
  }

  // Helper functions
  findFileParent(needle: File, haystack?: File): File {
    const haystackContents = haystack ? haystack.contents as File[] : this.files;

    for (const hay of haystackContents) {
      if (hay === needle) {
        return haystack;
      } else if (hay.contents instanceof Array) {
        return this.findFileParent(needle, hay);
      }
    }
  }

  // Cleanup
  ngOnDestroy() {
    this.fileTreeClickSub.unsubscribe();
  }

}
