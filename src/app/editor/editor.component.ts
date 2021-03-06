// Angular imports
import { Component, HostBinding, HostListener, Input, OnDestroy, OnInit } from '@angular/core';

// Dependency imports
import { Subscription } from 'rxjs';
import { faCode, faEllipsisV, faTimes } from '@fortawesome/pro-light-svg-icons';

// CodeMirror
  // Languages
  import 'codemirror/mode/clike/clike';
  import 'codemirror/mode/xml/xml';
  import './languages/javascript';
  import './languages/htmlmixed';
  import './languages/ngtemplate';
  import './languages/css';
  import './languages/php';

  // Addons
  import 'codemirror/addon/selection/active-line';
  import 'codemirror/addon/edit/closebrackets';
  import 'codemirror/addon/edit/closetag';
  import 'codemirror/addon/edit/matchtags';
  import 'codemirror/addon/edit/matchbrackets';
  import 'codemirror/addon/scroll/simplescrollbars';

// App imports
import { EditorFile, createFile } from './file.model';
import { Tab, createTab } from './tab.model';
import { EditorService } from './editor.service';
import { AuthService } from '../shared/auth.service';
import { DeviceDetectorService } from 'ngx-device-detector';

// Component config
@Component({
  selector: 'dm-editor',
  templateUrl: './editor.component.html',
  styleUrls: ['./editor.component.scss']
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
    public authService: AuthService,
    public deviceDetector: DeviceDetectorService
  ) {}

  // Init
  ngOnInit() {
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
    this.selectedFile = file;

    // Don't open folders as tabs
    if (file.type === 'folder') {
      return;
    }

    // If this is a double click, make the temp tab permanent
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
        // If the new file content is empty, create a dummy file to clear the contents in the editor
        // (Prevents the old code being shown with the wrong mode applied while waiting on the new file content)
        if (!file.contents) {
          tab.file = createFile(file.name, file.type, '\n');
          // Replace the dummy file with the correct file
          setTimeout(() => { tab.file = file; });
        } else {
          tab.file = file;
        }
        tab.editorOptions = this.getEditorOptionsForFile(file);
        this.activeTab = tab;
        return;
      }
    }

    // Create a new tab and make it active
    this.tabs.push(createTab('temp', file, this.getEditorOptionsForFile(file)));
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
        const needsNewActiveTab = this.activeTab === this.tabs[i];

        // Confirm before closing if the file has been modified
        if (tab.file.contents !== tab.file.initialContent) {
          if (confirm('Close this file? Unsaved changes will be lost!')) {
            // reset the file back to its initial content
            tab.file.contents = tab.file.initialContent;
          } else {
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


  // File editing

  onNewFileOrFolder(isFolder = false) {
    this.editorService.createFileOrFolder(isFolder, this.selectedFile);
  }

  onEditorChange($event, tab: Tab) {
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
      this.sidebarWidth = Math.min(this.sidebarStartingWidth + ($event.clientX - this.resizeStartPos), 600);
    }
  }


  // Helper functions

  getEditorOptionsForFile(file: EditorFile): {} {
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
      mode: this.editorService.getModeForType(file.type),
      addModeClass: true,
      extraKeys: { 'Shift-Tab': 'indentLess' },
      workTime: 200,
      workDelay: 1000
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
