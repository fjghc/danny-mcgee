// Angular imports
import { Component, ElementRef, HostBinding, OnDestroy, OnInit, ViewChild } from '@angular/core';

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
import { AuthService } from '../../auth/auth.service';
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
  @ViewChild('menuLock') menuLock: ElementRef;

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
      () => this.onSwipeLeft()
    );
    this.swipeRightSub = this.gestureHandler.swipeRight.subscribe(
      () => this.onSwipeRight()
    );
  }

  // Events
  onMenuLock() {
    this.isLocked = !this.isLocked;
  }

  onClickMenuLock() {
    this.onMenuLock();
    this.menuLock.nativeElement.blur();
  }

  onHover() {
    this.isHovered = true;
  }

  onBlur() {
    this.isHovered = false;
  }

  onSwipeLeft() {
    this.isPeeked = true;
    if (this.peekTimer) {
      clearTimeout(this.peekTimer);
    }
    this.peekTimer = setTimeout(() => {
      this.isPeeked = false;
    }, 4000);
  }

  onSwipeRight() {
    if (this.peekTimer) {
      clearTimeout(this.peekTimer);
    }
    this.isPeeked = false;
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
