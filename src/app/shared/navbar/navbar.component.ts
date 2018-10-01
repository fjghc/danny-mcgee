import { Component, HostBinding, OnInit } from '@angular/core';

import {
  faUserCircle,
  faFileAlt,
  faChartBar,
  faBriefcase,
  faCode,
  faLockAlt,
  faBars, faEnvelope
} from '@fortawesome/pro-light-svg-icons';
import { faGithub } from '@fortawesome/free-brands-svg-icons';

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
    lock: faLockAlt
  };

  @HostBinding('class.expanded') isExpanded = false;
  @HostBinding('class.hover') isHovered = false;

  constructor() {}

  ngOnInit() {}

  onExpandMenu() {
    this.isExpanded = !this.isExpanded;
  }

  onHover() {
    this.isHovered = true;
  }

  onBlur() {
    this.isHovered = false;
  }
}
