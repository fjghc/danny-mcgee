// Angular imports
import { Component, EventEmitter, Input, Output } from '@angular/core';

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

  // Event Emitters
  @Output() closeMenu = new EventEmitter();

  // Services
  constructor(private deviceDetector: DeviceDetectorService) {}

  // Events
  onNavigate() {
    if (this.deviceDetector.isMobile()) {
      this.closeMenu.emit();
    }
  }

}
