import { Component, HostBinding, OnInit } from '@angular/core';

import {
  faUserCircle,
  faFileAlt,
  faChartBar,
  faBriefcase,
  faCode,
  faLock,
  faBars, faEnvelope, faSignOutAlt
} from '@fortawesome/free-solid-svg-icons';
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
    resume: faFileAlt,
    skills: faChartBar,
    portfolio: faBriefcase,
    contact: faEnvelope,
    github: faGithub,
    code: faCode,
    login: faLock,
    logout: faSignOutAlt
  };

  @HostBinding('class.expanded') isLocked = false;
  @HostBinding('class.hover') isHovered = false;

  constructor(public authService: AuthService) {}

  ngOnInit() {}

  onLockMenu() {
    this.isLocked = !this.isLocked;
  }

  onKeyDownMenuLock($event) {
    if ($event.key === 'Enter' || $event.key === ' ') {
      this.onLockMenu();
    }
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
