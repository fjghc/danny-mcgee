import { Component, ElementRef, HostBinding, Input, OnDestroy, OnInit, ViewChild } from '@angular/core';
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
  constructor(private editorService: EditorService) {}

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
    console.log('file tree click');
    this.editorService.fileTreeClick.next(this.file);
    this.lastClicked = true;
  }

  onNewFile() {
    setTimeout(() => this.newFileNameInput.nativeElement.focus());
  }

  onKeyDownNameInput($event) {
    if ($event.key === 'Enter') {
      this.onCommitNewFile(this.newFileNameInput.nativeElement.value);
    }
    if ($event.key === 'Escape') {
      this.onDelete();
    }
  }

  onCommitNewFile(name: string) {
    if (name.length > 0) {
      // Name the new file
      console.log('file named: ' + name);
      this.file.name = name;
      this.file.path += name;

      if (this.file.type !== 'folder') {
        this.file.path += '/';

        // Set the file type
        const extension = this.editorService.getFileExtension(name);
        if (extension) {
          console.log('setting type to ' + extension);
          this.file.type = extension;
          this.setIcons();
        } else {
          console.log('ERROR: no extension for filename ' + name);
        }

        // Initialize contents
        this.file.contents = '\n';
        this.file.initialContent = '\n';
      }

      // Let the EditorService know
      // TODO: Simplify by calling newFile with no argument
      this.editorService.newFileCommitted.next(this.file);

      // Clear the new file
      this.newFile = false;
    }
  }

  onDelete() {
    console.log('new file cancelled!');
    this.editorService.deleteFile(this.file);
  }

  // Cleanup
  ngOnDestroy() {
    this.fileClickSub.unsubscribe();
    this.newFileSub.unsubscribe();
  }
}
