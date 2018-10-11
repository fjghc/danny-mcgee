import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { File } from '../file.model';
import { EditorService } from '../editor.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'dm-filetree',
  templateUrl: './filetree.component.html',
  styleUrls: ['./filetree.component.scss']
})
export class FiletreeComponent implements OnInit, OnDestroy {

  @Input() files: File[];
  newFileSub: Subscription;
  hasNewFile = false;

  constructor(private editorService: EditorService) {}

  ngOnInit() {
    this.newFileSub = this.editorService.newFile.subscribe(
      () => this.hasNewFile = true
    );
  }

  onDeselect() {
    console.log('deselector clicked');
    this.editorService.fileTreeClick.next(null);
  }

  ngOnDestroy() {
    this.newFileSub.unsubscribe();
  }

}
