import { Component, OnInit } from '@angular/core';
import { ProjectsService } from '../projects.service';
import { Project } from '../project.model';
import { ActivatedRoute } from '@angular/router';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { faCode, faDesktop, faMobile, faSpinnerThird, faTablet, faTimes } from '@fortawesome/pro-light-svg-icons';

@Component({
  selector: 'dm-project-detail',
  templateUrl: './project-detail.component.html',
  styleUrls: ['./project-detail.component.scss']
})
export class ProjectDetailComponent implements OnInit {

  project: Project;
  activeTab = 'desktop';
  bypassedUrl: SafeResourceUrl;
  icons = {
    desktop: faDesktop,
    tablet: faTablet,
    mobile: faMobile,
    code: faCode,
    close: faTimes,
    spinner: faSpinnerThird
  };

  constructor(
    private projectsService: ProjectsService,
    private route: ActivatedRoute,
    private sanitizer: DomSanitizer
  ) {}

  ngOnInit() {
    this.route.params.subscribe(
      params => {
        this.project = this.projectsService.getProjectByRef(params['path']);
        this.bypassedUrl = this.sanitizer.bypassSecurityTrustResourceUrl(this.project.url);
      }
    );
  }

  onTab(tab: string) {
    console.log('active tab is ' + tab);
    this.activeTab = tab;
  }

  onClose() {
    this.projectsService.closeActiveProject.emit('close');
  }

}
