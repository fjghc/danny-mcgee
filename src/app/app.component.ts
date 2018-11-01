// TODO: Remove all async pipes from the entire app and stop setting object properties to promises or observables

import { Component, HostListener, OnDestroy, OnInit, Renderer2 } from '@angular/core';
import { AuthService } from './shared/auth.service';
import { Subscription } from 'rxjs';
import { DeviceDetectorService } from 'ngx-device-detector';
import { GestureHandler } from './core/gesture-handler.service';

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
    private renderer: Renderer2,
    public gestureHandler: GestureHandler
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

  @HostListener('document:swipeleft')
  onSwipeLeft() {
    this.gestureHandler.swipeLeft.next();
  }

  @HostListener('document:swiperight')
  onSwipeRight() {
    this.gestureHandler.swipeRight.next();
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }

}
