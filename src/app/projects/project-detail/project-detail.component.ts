import { Component, ElementRef, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { ProjectsService } from '../projects.service';
import { Project } from '../project.model';
import { ActivatedRoute, Router } from '@angular/router';
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
  timeout: number;
  @ViewChild('iframe') iframe: ElementRef;
  subscription: Subscription;

  constructor(
    private projectsService: ProjectsService,
    private route: ActivatedRoute,
    private router: Router,
    private sanitizer: DomSanitizer
  ) {}

  ngOnInit() {
    this.subscription = this.route.paramMap.subscribe(
      paramMap => {
        if (paramMap.get('path')) {
          this.resolveRoute(paramMap.get('path'));
        }
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
    this.projectsService.closeActiveProject.next('close');
  }

  resolveRoute(path: string) {
    const project = this.projectsService.getProject(path, 'db');
    if (project !== null) {
      clearTimeout(this.timeout);
      this.project = project;
      this.bypassedUrl = this.sanitizer.bypassSecurityTrustResourceUrl(this.project.url);
      this.projectsService.viewProject.next();
    } else {
      if (this.projectsService.projects === undefined) {
        // We haven't received the projects from the db yet
        this.timeout = setTimeout(() => this.resolveRoute(path), 100);
      } else {
        // We have the projects but there's none matching this id; must be 404
        this.router.navigate(['/projects']);
      }
    }
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }

}
