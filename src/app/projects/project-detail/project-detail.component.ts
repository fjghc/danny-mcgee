import { Component, ElementRef, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { ProjectsService } from '../projects.service';
import { Project } from '../project.model';
import { ActivatedRoute } from '@angular/router';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { faCode, faDesktop, faMobile, faSpinnerThird, faTablet, faTimes } from '@fortawesome/pro-light-svg-icons';
import { Subscription } from 'rxjs';

@Component({
  selector: 'dm-project-detail',
  templateUrl: './project-detail.component.html',
  styleUrls: ['./project-detail.component.scss']
})
export class ProjectDetailComponent implements OnInit, OnDestroy {

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
  @ViewChild('iframe') iframe: ElementRef;
  subscription: Subscription;

  constructor(
    private projectsService: ProjectsService,
    private route: ActivatedRoute,
    private sanitizer: DomSanitizer
  ) {}

  ngOnInit() {
    this.subscription = this.route.params.subscribe(
      params => {
        this.project = this.projectsService.getProject(params['path'], 'db');
        this.bypassedUrl = this.sanitizer.bypassSecurityTrustResourceUrl(this.project.url);
      }
    );
  }

  onTab(tab: string) {
    this.activeTab = tab;
    if (this.project.needsRefresh && this.iframe !== undefined) {
      this.iframe.nativeElement.src = this.project.url;
    }
  }

  onClose() {
    this.projectsService.closeActiveProject.emit('close');
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }

}
