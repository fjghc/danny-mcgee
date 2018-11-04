// Angular imports
import { Component, OnDestroy, OnInit } from '@angular/core';
import { Router, RouterEvent, RoutesRecognized } from '@angular/router';

// Dependency imports
import { Subscription } from 'rxjs';
import { DeviceDetectorService } from 'ngx-device-detector';

// App imports
import { AuthService } from '../../shared/auth.service';
import { ProjectsService } from '../../pages/projects/projects.service';
import { fadeConfig } from '../../shared/animations/animation.configs';
import { headerTitleTransition } from '../core.animations';

// Component config
@Component({
  selector: 'dm-header',
  animations: [headerTitleTransition],
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit, OnDestroy {

  // Data
  pageTitle: string;

  // State
  titleAnimState = 'in';

  // Subs
  routerEventsSub: Subscription;

  // Services
  constructor(
    public authService: AuthService,
    public projectsService: ProjectsService,
    public deviceDetector: DeviceDetectorService,
    private router: Router
  ) { }

  // Init
  ngOnInit() {
    this.routerEventsSub = this.router.events.subscribe(
      event => this.onRouterEvent(event as RouterEvent)
    );
  }

  // Events
  onRouterEvent(event: RouterEvent) {
    if (event instanceof RoutesRecognized) {
      const url = event.url.toString();
      this.titleAnimState = 'out';
      setTimeout(() => {
        this.pageTitle = this.getPageTitleForUrl(url);
        this.titleAnimState = 'in';
      }, fadeConfig.delay);
    }
  }

  // Data manipulation
  getPageTitleForUrl(url: string): string {
    if (url === '/') {
      return 'dannymcgee.io';
    }
    if (url === '/login') {
      return 'Login';
    }
    if (url === '/experience') {
      return 'Experience';
    }
    if (url === '/skills') {
      return 'Skills';
    }
    if (/\bprojects\b/.test(url)) {
      return 'Projects';
    }
    if (url === '/contact') {
      return 'Contact';
    }
    if (url === '/view-source') {
      return 'View Source';
    }
    return null;
  }

  // Cleanup
  ngOnDestroy() {
    this.routerEventsSub.unsubscribe();
  }

}
