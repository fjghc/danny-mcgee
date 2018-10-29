// TODO: Remove all async pipes from the entire app and stop setting object properties to promises or observables

import { Component, OnDestroy, OnInit, Renderer2 } from '@angular/core';
import { AuthService } from './auth/auth.service';
import { Subscription } from 'rxjs';
import { DeviceDetectorService } from 'ngx-device-detector';

@Component({
  selector: 'dm-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit, OnDestroy {

  subscription: Subscription;

  constructor(
    private authService: AuthService,
    private deviceDetector: DeviceDetectorService,
    private renderer: Renderer2
  ) {}

  ngOnInit() {
    this.subscription = this.authService.listenForAuthChanges().subscribe(
      () => {
        this.authService.setAuthenticationStatus();
      }
    );
    this.renderer.addClass(document.body, this.deviceDetector.getDeviceInfo().browser);
    this.renderer.addClass(
      document.body,
      this.deviceDetector.isMobile() ? 'mobile'
          : this.deviceDetector.isTablet() ? 'tablet'
          : this.deviceDetector.isDesktop() ? 'desktop'
          : ''
    );
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }

}
