import { Component, Input, OnInit } from '@angular/core';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { Project } from '../project.model';
import { ProjectsService } from '../projects.service';

@Component({
  selector: 'dm-project-item',
  templateUrl: './project-item.component.html',
  styleUrls: ['./project-item.component.scss']
})
export class ProjectItemComponent implements OnInit {

  @Input() project: Project;
  bypassedUrl: SafeResourceUrl;

  constructor(
    public projectsService: ProjectsService,
    private sanitizer: DomSanitizer
  ) {}

  ngOnInit() {
    this.bypassedUrl = this.sanitizer.bypassSecurityTrustResourceUrl(this.project.url);
  }

}
