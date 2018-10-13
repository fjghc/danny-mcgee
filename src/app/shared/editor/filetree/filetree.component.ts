import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { EditorFile } from '../file.model';
import { EditorService } from '../editor.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'dm-filetree',
  templateUrl: './filetree.component.html',
  styleUrls: ['./filetree.component.scss']
})
export class FiletreeComponent implements OnInit, OnDestroy {

  @Input() files: EditorFile[];
  hasNewFile = false;

  // Subs
  newFileSub: Subscription;
  nweFileCommittedSub: Subscription;

  constructor(private editorService: EditorService) {}

  ngOnInit() {
    this.newFileSub = this.editorService.newFile.subscribe(
      file => this.hasNewFile = !!file
    );
    this.nweFileCommittedSub = this.editorService.newFileCommitted.subscribe(
      () => this.hasNewFile = false
    );
  }

  onDeselect() {
    console.log('deselector clicked');
    this.editorService.fileTreeClick.next(null);
  }

  ngOnDestroy() {
    this.newFileSub.unsubscribe();
    this.nweFileCommittedSub.unsubscribe();
  }

}
