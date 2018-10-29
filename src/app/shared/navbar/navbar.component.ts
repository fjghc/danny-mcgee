import { Component, ElementRef, HostBinding, OnInit, ViewChild } from '@angular/core';

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
import { AuthService } from '../../auth/auth.service';

@Component({
  selector: 'dm-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.scss']
})
export class NavbarComponent implements OnInit {

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

  @HostBinding('class.expanded') isLocked = false;
  @HostBinding('class.hover') isHovered = false;

  constructor(public authService: AuthService) {}

  ngOnInit() {}

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

  onLogout() {
    this.authService.logout();
  }
}
