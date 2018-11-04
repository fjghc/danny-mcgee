// Angular imports
import { Component, Input, OnDestroy, OnInit } from '@angular/core';

// Dependency imports
import { Subscription } from 'rxjs';

// App imports
import { EditorFile } from '../file.model';
import { EditorService } from '../editor.service';

// Component config
@Component({
  selector: 'dm-filetree',
  templateUrl: './filetree.component.html',
  styleUrls: ['./filetree.component.scss']
})
export class FiletreeComponent implements OnInit, OnDestroy {

  // Data
  @Input() files: EditorFile[];

  // State
  hasNewFile = false;

  // Subs
  newFileSub: Subscription;
  nweFileCommittedSub: Subscription;

  // Services
  constructor(private editorService: EditorService) {}

  // Init
  ngOnInit() {
    this.newFileSub = this.editorService.newFile.subscribe(
      file => this.hasNewFile = !!file
    );
    this.nweFileCommittedSub = this.editorService.newFileCommitted.subscribe(
      () => this.hasNewFile = false
    );
  }

  // Events
  onDeselect() {
    console.log('deselector clicked');
    this.editorService.fileTreeClick.next(null);
  }

  // Cleanup
  ngOnDestroy() {
    this.newFileSub.unsubscribe();
    this.nweFileCommittedSub.unsubscribe();
  }

}
