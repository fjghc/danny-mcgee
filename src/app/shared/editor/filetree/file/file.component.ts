import { Component, HostBinding, Input, OnInit } from '@angular/core';
import { File } from '../../../file.model';
import { IconDefinition } from '@fortawesome/fontawesome-common-types';
import { EditorService } from '../../editor.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'dm-file',
  templateUrl: './file.component.html',
  styleUrls: ['./file.component.scss']
})
export class FileComponent implements OnInit {

  // Data
  @Input() file: File;
  icon: IconDefinition | IconDefinition[];
  angleIcon: IconDefinition;

  // State
  @Input() indent: number;
  isOpen = false;
  lastClicked = false;

  // Subs
  fileClickSub: Subscription;

  // Services
  constructor(private editorService: EditorService) { }

  // Init
  ngOnInit() {
    this.setIcons();
    this.fileClickSub = this.editorService.openFile.subscribe(
      () => this.lastClicked = false
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

  onOpenFile() {
    this.editorService.openFile.next(this.file);
    this.lastClicked = true;
  }

}
