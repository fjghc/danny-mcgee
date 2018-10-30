// Angular imports
import { Component, ElementRef, EventEmitter, Input, Output, ViewChild } from '@angular/core';

// Dependency imports
import { IconDefinition } from '@fortawesome/fontawesome-common-types';
import { DeviceDetectorService } from 'ngx-device-detector';

// Component config
@Component({
  selector: 'dm-menu-item',
  templateUrl: './menu-item.component.html',
  styleUrls: ['./menu-item.component.scss']
})
export class MenuItemComponent {

  // Data
  @Input() routerLink: string;
  @Input() link: string;
  @Input() icon: IconDefinition;
  @Input() extraClass: string;
  @ViewChild('anchor') anchor: ElementRef;

  // Event Emitters
  @Output() closeMenu = new EventEmitter();
  @Output() activate = new EventEmitter();

  // Services
  constructor(private deviceDetector: DeviceDetectorService) {}

  // Events
  onNavigate() {
    if (this.deviceDetector.isMobile()) {
      this.closeMenu.emit();
    }
  }

  onActivate() {
    this.activate.emit();
  }

  onClick() {
    this.onActivate();
    if (this.extraClass === 'menu-lock') {
      this.anchor.nativeElement.blur();
    }
  }

}
