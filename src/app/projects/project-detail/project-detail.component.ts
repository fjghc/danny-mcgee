// Angular imports
import { Component, ElementRef, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { ActivatedRoute, Router } from '@angular/router';

// Dependency imports
import { Subscription } from 'rxjs';
import {
  faCode,
  faDesktop,
  faMobile,
  faSpinnerThird,
  faTablet,
  faTimes,
  faUmbrellaBeach,
  faPalette
} from '@fortawesome/pro-light-svg-icons';
import { faWordpressSimple } from '@fortawesome/free-brands-svg-icons';

// App imports
import { ProjectsService } from '../projects.service';
import { Project } from '../project.model';
import { DataHandler } from '../../shared/data-handler.service';
import { dmCodeAlt, dmIllustrator, dmPhotoshop } from '../../shared/icon-definitions';

// Component config
@Component({
  selector: 'dm-project-detail',
  templateUrl: './project-detail.component.html',
  styleUrls: ['./project-detail.component.scss']
})
export class ProjectDetailComponent implements OnInit, OnDestroy {

  // Data
  project: Project;
  icons = {
    desktop: faDesktop,
    tablet: faTablet,
    mobile: faMobile,
    code: faCode,
    close: faTimes,
    spinner: faSpinnerThird,
    personal: faUmbrellaBeach,
    design: faPalette,
    'front-end': faCode,
    'back-end': dmCodeAlt,
    'back-end-partial': dmCodeAlt,
    photoshop: dmPhotoshop,
    illustrator: dmIllustrator,
    wordpress: faWordpressSimple,
  };
  bypassedUrl: SafeResourceUrl;
  @ViewChild('iframe') iframe: ElementRef;

  // State
  activeTab = 'desktop';
  timeout: number;

  // Subs
  routeSub: Subscription;

  // Services
  constructor(
    private projectsService: ProjectsService,
    private dataHandler: DataHandler,
    private route: ActivatedRoute,
    private router: Router,
    private sanitizer: DomSanitizer
  ) {}

  // Init
  ngOnInit() {
    this.routeSub = this.route.paramMap.subscribe(
      paramMap => {
        if (paramMap.get('path')) {
          this.resolveRoute(paramMap.get('path'));
        }
      }
    );
  }

  // Events
  onTab(tab: string) {
    this.activeTab = tab;
    if (this.project.needsRefresh && this.iframe !== undefined) {
      this.iframe.nativeElement.src = this.project.url;
    }
  }

  onClose() {
    this.projectsService.closeActiveProject.next('close');
  }

  // Data manipulation
  resolveRoute(path: string) {
    const project = this.projectsService.getProject(path, 'db');
    if (project !== null) {
      clearTimeout(this.timeout);
      this.project = project;
      this.bypassedUrl = this.sanitizer.bypassSecurityTrustResourceUrl(this.project.url);
      this.fetchAdditionalData();
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

  fetchAdditionalData() {
    const collRef = 'projects';
    const docRef = this.project.id;

    // Handle Responsibilities
    this.dataHandler.getSubCollection(collRef, docRef, 'responsibilities')
      .then(response => {
        this.project.responsibilities = [];

        for (const item of response) {
          this.project.responsibilities.push({ icon: this.icons[item.class.split(' ')[0]], class: item.class, tooltip: item.tooltip });
        }
      });

    // Handle Tools
    this.dataHandler.getSubCollection(collRef, docRef, 'tools')
      .then(response => {
        this.project.tools = [];

        for (const item of response) {
          this.project.tools.push({ icon: this.icons[item.class.split(' ')[0]], class: item.class, tooltip: item.tooltip });
        }
      });
  }

  // Cleanup
  ngOnDestroy() {
    this.routeSub.unsubscribe();
  }

}
