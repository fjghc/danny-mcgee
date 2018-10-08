import { Component, Input, OnInit } from '@angular/core';
import { File } from '../../../file.model';
import { IconDefinition } from '@fortawesome/fontawesome-common-types';
import { EditorService } from '../../editor.service';
import { Tab, createTab } from '../../tab.model';

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
  isOpen = false;
  isSingleClick = false;

  constructor(private editorService: EditorService) { }

  ngOnInit() {
    this.setIcons();
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

  onToggleOpen() {
    this.isOpen = !this.isOpen;
    this.setIcons();
  }

  onOpenFile() {
    this.editorService.openFile.next(this.file);
  }

}
