// Angular imports
import { Component, HostBinding, OnDestroy, OnInit } from '@angular/core';

// Depdendency imports
import {
  faUserCircle,
  faFileAlt,
  faChartBar,
  faCode,
  faLockAlt,
  faBars,
  faEnvelope,
  faSignOut,
  faDesktop
} from '@fortawesome/pro-light-svg-icons';
import { faGithub } from '@fortawesome/free-brands-svg-icons';

// App imports
import { AuthService } from '../../shared/auth.service';
import { GestureHandler } from '../gesture-handler.service';
import { Subscription } from 'rxjs';

// Component config
@Component({
  selector: 'dm-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.scss']
})
export class NavbarComponent implements OnInit, OnDestroy {

  // Data
  icons = {
    menu: faBars,
    about: faUserCircle,
    experience: faFileAlt,
    skills: faChartBar,
    projects: faDesktop,
    contact: faEnvelope,
    github: faGithub,
    code: faCode,
    login: faLockAlt,
    logout: faSignOut
  };
  mainMenuItems = [
    { name: 'Experience', routerLink: '/experience', icon: this.icons.experience },
    { name: 'Skills', routerLink: '/skills', icon: this.icons.skills },
    { name: 'Projects', routerLink: '/projects', icon: this.icons.projects },
    { name: 'Contact', routerLink: '/contact', icon: this.icons.contact },
  ];

  // State
  @HostBinding('class.expanded') isLocked = false;
  @HostBinding('class.hover') isHovered = false;
  @HostBinding('class.peek') isPeeked = false;
  peekTimer: number;

  // Subs
  swipeLeftSub: Subscription;
  swipeRightSub: Subscription;

  // Services
  constructor(
    public authService: AuthService,
    private gestureHandler: GestureHandler
  ) {}

  // Init
  ngOnInit() {
    this.swipeLeftSub = this.gestureHandler.swipeLeft.subscribe(
      () => this.onPeek(3000)
    );
    this.swipeRightSub = this.gestureHandler.swipeRight.subscribe(
      () => this.onUnpeek()
    );
  }

  // Events
  onMenuLock() {
    this.isLocked = !this.isLocked;
  }

  onHover() {
    this.isHovered = true;
  }

  onBlur() {
    this.isHovered = false;
  }

  onPeek(timeout: number) {
    this.isPeeked = true;
    if (this.peekTimer) {
      clearTimeout(this.peekTimer);
    }
    this.peekTimer = setTimeout(() => {
      this.isPeeked = false;
    }, timeout);
  }

  onUnpeek() {
    if (this.peekTimer) {
      clearTimeout(this.peekTimer);
    }
    this.isPeeked = false;
  }

  onCloseMenu() {
    this.isLocked = false;
  }

  onLogout() {
    this.authService.logout();
  }

  // Cleanup
  ngOnDestroy() {
    this.swipeLeftSub.unsubscribe();
    this.swipeRightSub.unsubscribe();
  }
}
