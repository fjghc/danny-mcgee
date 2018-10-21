import { Component, OnDestroy, OnInit } from '@angular/core';
import { Router, RoutesRecognized } from '@angular/router';
import { AuthService } from '../../auth/auth.service';
import { Subscription } from 'rxjs';
import { ProjectsService } from '../../projects/projects.service';

@Component({
  selector: 'dm-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit, OnDestroy {

  pageTitle: string;
  subscription: Subscription;

  constructor(
    public authService: AuthService,
    public projectsService: ProjectsService,
    private router: Router
  ) { }

  ngOnInit() {
    this.subscription = this.router.events.subscribe(
      event => {
        if (event instanceof RoutesRecognized) {
          const url = event.url.toString();

          this.pageTitle = this.getPageTitleForUrl(url);
        }
      }
    );
  }

  getPageTitleForUrl(url: string): string {
    if (url === '/') {
      return 'Home';
    }
    if (url === '/login') {
      return 'Login';
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
