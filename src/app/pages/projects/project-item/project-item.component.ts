import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { Project } from '../project.model';

@Component({
  selector: 'dm-project-item',
  templateUrl: './project-item.component.html',
  styleUrls: ['./project-item.component.scss']
})
export class ProjectItemComponent implements OnInit {

  @Input() project: Project;
  bypassedUrl: SafeResourceUrl;
  // image: HTMLImageElement;
  imageLocation: string;

  @Output() imageReady = new EventEmitter();

  constructor(private sanitizer: DomSanitizer) {}

  ngOnInit() {
    this.imageLocation = `assets/projects/${this.project.id}.${this.project.imageFormat}`;
    const image = new Image();
    image.src = this.imageLocation;
    image.onload = () => {
      this.imageReady.emit();
    };
    this.bypassedUrl = this.sanitizer.bypassSecurityTrustResourceUrl(this.project.url);
  }

}
