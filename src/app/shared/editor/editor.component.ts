// Angular imports
import { Component, Input, OnDestroy, OnInit } from '@angular/core';

// App imports
import { File } from '../file.model';
import { Tab, createTab } from './tab.model';
import { EditorService } from './editor.service';
import { Subscription } from 'rxjs';
import { faTimes } from '@fortawesome/pro-light-svg-icons';
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
  @Input() files: File[];
  tabs: Tab[] = [];
  closeIcon = faTimes;

  // State
  activeTab: Tab;
  justOpenedFile: File = null;

  // Subs
  openFileSub: Subscription;

  // Services
  constructor(
    public editorService: EditorService,
    private dataHandler: DataHandler
  ) {}

  // Init
  ngOnInit() {
    this.openFileSub = this.editorService.openFile.subscribe(
      file => this.onOpenFile(file)
    );
  }

  // Events
  onOpenFile(file: File) {
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

    // If there's already a temp tab open, replace its file with this one and make it active
    for (const tab of this.tabs) {
      if (tab.type === 'temp') {
        tab.file = file;
        this.activeTab = tab;
        return;
      }
    }

    // If there's NOT already a temp tab open, create one and make it active
    this.tabs.push(createTab('temp', file));
    this.activeTab = this.tabs[this.tabs.length - 1];

    // Generate the MonacoFile
    this.editorService.setupFileContent(file);

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

  // Cleanup
  ngOnDestroy() {
    this.openFileSub.unsubscribe();
  }

}
