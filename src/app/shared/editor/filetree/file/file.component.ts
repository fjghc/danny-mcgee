import { Component, HostBinding, Input, OnDestroy, OnInit } from '@angular/core';
import { File } from '../../file.model';
import { IconDefinition } from '@fortawesome/fontawesome-common-types';
import { EditorService } from '../../editor.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'dm-file',
  templateUrl: './file.component.html',
  styleUrls: ['./file.component.scss']
})
export class FileComponent implements OnInit, OnDestroy {

  // Data
  @Input() file: File;
  icon: IconDefinition | IconDefinition[];
  angleIcon: IconDefinition;

  // State
  @Input() indent: number;
  @HostBinding('class.new') newFile = false;
  isOpen = false;
  lastClicked = false;

  // Subs
  fileClickSub: Subscription;
  newFileSub: Subscription;

  // Services
  constructor(private editorService: EditorService) { }

  // Init
  ngOnInit() {
    this.setIcons();
    this.fileClickSub = this.editorService.fileTreeClick.subscribe(
      file => {
        if (file !== this.file) {
          this.lastClicked = false;
        }
      }
    );
    this.newFileSub = this.editorService.newFile.subscribe(
      file => {
        console.log('new file event received');
        if (file === this.file) {
          console.log('it\'s this one!');
          this.newFile = true;
        }
      }
    );
  }

  setIcons() {
    if (this.file.type === 'folder') {
      const icons = this.editorService.getIconForType(this.file.type, this.isOpen);
      this.icon = icons[0];
      this.angleIcon = icons[1];
    } else {
      this.icon = this.editorService.getIconForType(this.file.type);
    }
  }

  // Events
  onToggleOpen() {
    this.isOpen = !this.isOpen;
    this.setIcons();
  }

  onFileTreeClick() {
    this.editorService.fileTreeClick.next(this.file);
    this.lastClicked = true;
  }

  // Cleanup
  ngOnDestroy() {
    this.fileClickSub.unsubscribe();
    this.newFileSub.unsubscribe();
  }
}
