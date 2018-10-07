import { Component, HostBinding, Input, OnInit } from '@angular/core';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { Project } from '../project.model';

@Component({
  selector: 'dm-project-item',
  templateUrl: './project-item.component.html',
  styleUrls: ['./project-item.component.scss']
})
export class ProjectItemComponent implements OnInit {

  @Input() project: Project;
  @HostBinding('class.personal') isPersonal = false;
  bypassedUrl: SafeResourceUrl;

  constructor(private sanitizer: DomSanitizer) {}

  ngOnInit() {
    this.bypassedUrl = this.sanitizer.bypassSecurityTrustResourceUrl(this.project.url);

    if (this.project.personal) {
      this.isPersonal = true;
    }
  }

}
