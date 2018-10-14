// Angular imports
import { Component, HostBinding, HostListener, Input, OnDestroy, OnInit } from '@angular/core';

// Dependency imports
import { Subscription } from 'rxjs';
import { faCode, faEllipsisV, faTimes } from '@fortawesome/pro-light-svg-icons';

// CodeMirror
  // Languages
  import 'codemirror/mode/clike/clike';
  import './languages/javascript';
  import './languages/htmlmixed';
  import 'codemirror/mode/xml/xml';
  import 'codemirror/mode/css/css';
  import 'codemirror/mode/sass/sass';
  import './languages/php';

  // Addons
  import 'codemirror/addon/selection/active-line';
  import 'codemirror/addon/edit/closebrackets';
  import 'codemirror/addon/edit/closetag';
  import 'codemirror/addon/edit/matchtags';
  import 'codemirror/addon/edit/matchbrackets';
  import 'codemirror/addon/scroll/simplescrollbars';

// App imports
import { EditorFile } from './file.model';
import { Tab, createTab } from './tab.model';
import { EditorService } from './editor.service';
import { AuthService } from '../../auth/auth.service';

// Component config
@Component({
  selector: 'dm-editor',
  templateUrl: './editor.component.html',
  styleUrls: ['./editor.component.scss'],
  providers: [EditorService]
})
export class EditorComponent implements OnInit, OnDestroy {

  // Data
  @Input() projectId: string;
  files: EditorFile[];
  tabs: Tab[] = [];
  icons = {
    close: faTimes,
    splash: faCode,
    resizer: faEllipsisV
  };

  // State
  @HostBinding('class.edit-mode') editMode: boolean;
  activeTab: Tab;
  justOpenedFile: EditorFile;
  selectedFile: EditorFile;
    // Sidebar
    sidebarWidth = 300;
    sidebarStartingWidth: number;
    resizing = false;
    resizeStartPos: number;

  // Subs
  filesSub: Subscription;
  fileTreeClickSub: Subscription;
  editModeSub: Subscription;

  // Services
  constructor(
    public editorService: EditorService,
    public authService: AuthService
  ) {}

  // Init
  ngOnInit() {
    // this.editorService.watchFiles(this.projectId);
    this.editModeSub = this.editorService.editMode.subscribe(
      editMode => this.onEditModeChange(editMode)
    );
    this.fileTreeClickSub = this.editorService.fileTreeClick.subscribe(
      file => {
        if (file) {
          this.onFileTreeClick(file);
        } else {
          this.selectedFile = null;
        }
      }
    );
  }


  // Events

  // Edit Mode changes

  onEditModeChange(editMode: boolean) {
    this.editMode = editMode;
    if (editMode) {
      this.filesSub.unsubscribe();
      this.files = this.editorService.getFilesCopy();
    } else {
      this.filesSub = this.editorService.watchFiles(this.projectId).subscribe(
        files => this.files = files
      );
    }
    // Nuke the current tabs since they point to the wrong files and updating them is complicated
    this.tabs = [];
    this.activeTab = null;
  }

  onActivateEditMode() {
    this.editorService.editMode.next(true);
  }

  onDiscardChanges() {
    if (confirm('Are you sure you want to discard your changes?')) {
      this.editorService.editMode.next(false);
    }
  }

  onSaveChanges() {
    if (confirm('Save changes and commit them to the database? Any existing files data will be overwritten!')) {
      this.editorService.commitChangesToDatabase();
    }
  }


  // Tabs manipulation

  onFileTreeClick(file: EditorFile) {
    console.log(`fileTreeClick: ${file.name}`);
    this.selectedFile = file;

    // Don't open folders as tabs
    if (file.type === 'folder') {
      console.log(`It's a folder, so return`);
      return;
    }

    // If this is a double click, make the temp tab permanent
    console.log(`Checking justOpenedFile: ${this.justOpenedFile ? this.justOpenedFile.name : ''}`);
    if (file === this.justOpenedFile) {
      console.log(`It's a double click, so make it permanent`);
      for (const tab of this.tabs) {
        if (tab.file === file) {
          tab.type = 'perm';
          return;
        }
      }
    }

    // Set this as the just-opened file to detect for double clicks
    console.log(`Setting ${file.name} to justOpenedFile`);
    this.justOpenedFile = file;

    // If this file is already open in a tab, make it active
    for (const tab of this.tabs) {
      if (file === tab.file) {
        console.log(`File is already open, so making it active`);
        this.activeTab = tab;
        return;
      }
    }

    // If we've made it this far, this file hasn't been opened yet
    // Set up the file contents
    console.log(`Getting content (if it doesn't exist already)`);
    this.editorService.setupFileContent(file);

    // If there's already a temp tab open, replace its file with this one and make it active
    for (const tab of this.tabs) {
      if (tab.type === 'temp') {
        console.log(`Already a temp tab open, so replace it with ${file.name}`);
        tab.file = file;
        this.activeTab = tab;
        return;
      }
    }

    // Create a new tab and make it active
    console.log(`Creating a new tab and making it active`);
    this.tabs.push(createTab('temp', file));
    this.activeTab = this.tabs[this.tabs.length - 1];

    // Set a timeout to watch for double clicks
    console.log(`Setting the double-click timeout`);
    setTimeout(() => {
      console.log(`Timeout! Clearing the justOpenedFile`);
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
          } else {
            // reset the file back to its initial content
            this.tabs[i].file.contents = this.tabs[i].file.initialContent;
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


  // File editing

  onNewFileOrFolder(isFolder = false) {
    this.editorService.createFileOrFolder(isFolder, this.selectedFile);
  }

  onEditorChange($event, tab: Tab) {
    console.log('onEditorChange called');
    tab.file.contents = $event;
    if (tab.type === 'temp') {
      tab.type = 'perm';
    }
  }

  onKeyDown($event, tab: Tab) {
    if ($event.key === 's' && $event.ctrlKey === true) {
      // Save the file
      $event.stopPropagation();
      $event.preventDefault();
      tab.file.initialContent = tab.file.contents as string;
      // Saves us from re-uploading unchanged files
      tab.file.isNewOrModified = true;
    }
  }

  onDeleteSelectedFile() {
    const isFolder = this.selectedFile.type === 'folder';
    const confirmMessage =
      'Are you sure you want to delete ' +
      (isFolder ? 'folder ' : '') +
      `'${this.selectedFile.name}'` +
      (isFolder ? ' and all of its contents?' : '?');

    if (confirm(confirmMessage)) {
      for (const tab of this.tabs) {
        if (tab.file.path === this.selectedFile.path) {
          this.onCloseTab(tab);
        }
      }
      this.editorService.addFileToDeleteList(this.selectedFile);
      this.editorService.deleteFile(this.selectedFile);
    }
  }


  // Sidebar resizing

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

  getEditorOptionsForTab(tab: Tab): {} {
    return {
      theme: 'dm',
      lineNumbers: true,
      styleActiveLine: true,
      indentWithTabs: true,
      tabSize: 2,
      autoCloseBrackets: true,
      autoCloseTags: true,
      matchTags: { bothTags: true },
      matchBrackets: true,
      scrollbarStyle: 'overlay',
      readOnly: !this.editMode,
      mode: this.editorService.getModeForType(tab.file.type),
      addModeClass: true,
      extraKeys: { 'Shift-Tab': 'indentLess' }
    };
  }


  // Cleanup
  ngOnDestroy() {
    if (this.filesSub) {
      this.filesSub.unsubscribe();
    }
    this.fileTreeClickSub.unsubscribe();
    this.editModeSub.unsubscribe();
  }

}
