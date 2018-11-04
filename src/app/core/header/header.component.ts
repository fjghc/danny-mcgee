import { Component, OnDestroy, OnInit } from '@angular/core';
import { Router, RoutesRecognized } from '@angular/router';
import { AuthService } from '../../shared/auth.service';
import { Subscription } from 'rxjs';
import { ProjectsService } from '../../pages/projects/projects.service';
import { DeviceDetectorService } from 'ngx-device-detector';
import { fadeConfig } from '../../shared/animations/animation.configs';
import { headerTitleTransition } from '../core.animations';

@Component({
  selector: 'dm-header',
  animations: [headerTitleTransition],
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit, OnDestroy {

  pageTitle: string;
  subscription: Subscription;
  titleAnimState = 'in';

  constructor(
    public authService: AuthService,
    public projectsService: ProjectsService,
    public deviceDetector: DeviceDetectorService,
    private router: Router
  ) { }

  ngOnInit() {
    this.subscription = this.router.events.subscribe(
      event => {
        if (event instanceof RoutesRecognized) {
          const url = event.url.toString();
          this.titleAnimState = 'out';
          setTimeout(() => {
            this.pageTitle = this.getPageTitleForUrl(url);
            this.titleAnimState = 'in';
          }, fadeConfig.delay);
        }
      }
    );
  }

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

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }

}
