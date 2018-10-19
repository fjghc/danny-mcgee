// Angular imports
import { Component, ElementRef, HostBinding, Input, OnDestroy, OnInit, ViewChild } from '@angular/core';

// Dependency imports
import { Subscription } from 'rxjs';
import { IconDefinition } from '@fortawesome/fontawesome-common-types';

// App imports
import { EditorFile } from '../../file.model';
import { EditorService } from '../../editor.service';

// Component config
@Component({
  selector: 'dm-file',
  templateUrl: './file.component.html',
  styleUrls: ['./file.component.scss']
})
export class FileComponent implements OnInit, OnDestroy {

  // Data
  @Input() file: EditorFile;
  icon: IconDefinition | IconDefinition[];
  angleIcon: IconDefinition;
  @ViewChild('newFileNameInput') newFileNameInput: ElementRef;

  // State
  @Input() indent: number;
  @HostBinding('class.new') newFile = false;
  isOpen = false;
  lastClicked = false;

  // Subs
  fileClickSub: Subscription;
  newFileSub: Subscription;

  // Services
  constructor(public editorService: EditorService) {}

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
        if (file === this.file) {
          this.newFile = true;
          this.onNewFile();
        }
      }
    );
  }

  setIcons() {
    if (this.file.type === 'folder') {
      const icons = this.editorService.getIconForType(this.file.type, this.isOpen);
      this.file.icon = icons[0];
      this.angleIcon = icons[1];
    } else {
      this.file.icon = this.editorService.getIconForType(this.file.type) as IconDefinition;
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
    if (this.file.type === 'folder') {
      this.onToggleOpen();
    }
  }

  onNewFile() {
    setTimeout(() => this.newFileNameInput.nativeElement.focus());
  }

  onKeyDownNameInput($event) {
    if ($event.key === 'Enter') {
      this.onCommitNewFile(this.newFileNameInput.nativeElement.value);
    }
    if ($event.key === 'Escape') {
      this.onCancelNewFile();
    }
  }

  onCommitNewFile(name: string) {
    if (name.length > 0) {
      // Name the new file
      this.file.name = name;
      this.file.path += name;

      if (this.file.type !== 'folder') {
        // Set the file type
        const type = this.editorService.getFileType(name);
        if (type) {
          this.file.type = type;
          this.setIcons();
        }

        // Initialize contents
        this.file.contents = '\n';
        this.file.initialContent = '\n';
        this.file.isNewOrModified = true;
      } else {
        this.file.path += '/';
        delete this.file.initialContent;
        delete this.file.isNewOrModified;
      }

      // Let the EditorService know
      this.editorService.sortParentArrayOfFile(this.file);
      this.editorService.newFile.next();

      // Clear the new file
      this.newFile = false;

      // Open the file in the editor or expand the folder
      this.editorService.fileTreeClick.next(this.file);
      this.lastClicked = true;
      if (this.file.type === 'folder') {
        this.isOpen = true;
        this.setIcons();
      }
    }
  }

  onCancelNewFile() {
    this.editorService.deleteFile(this.file);
    this.editorService.newFile.next();
  }

  // Cleanup
  ngOnDestroy() {
    this.fileClickSub.unsubscribe();
    this.newFileSub.unsubscribe();
  }
}
