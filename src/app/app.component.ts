// Angular imports
import { Component, HostListener, OnDestroy, OnInit, Renderer2 } from '@angular/core';

// Dependency imports
import { Subscription } from 'rxjs';
import { DeviceDetectorService } from 'ngx-device-detector';

// App imports
import { AuthService } from './shared/auth.service';
import { GestureHandler } from './core/gesture-handler.service';
import { RouterOutlet } from '@angular/router';
import { routerTransition } from './core/router.animations';

// Component config
@Component({
  selector: 'dm-root',
  animations: [routerTransition],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit, OnDestroy {

  // Subs
  authSub: Subscription;

  // Services
  constructor(
    private authService: AuthService,
    private deviceDetector: DeviceDetectorService,
    private renderer: Renderer2,
    public gestureHandler: GestureHandler
  ) {}

  // Init
  ngOnInit() {
    this.authSub = this.authService.listenForAuthChanges().subscribe(
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

  // State management
  getState(outlet: RouterOutlet) {
    return outlet.activatedRouteData.state;
  }

  // Events
  @HostListener('document:swipeleft')
  onSwipeLeft() {
    this.gestureHandler.swipeLeft.next();
  }

  @HostListener('document:swiperight')
  onSwipeRight() {
    this.gestureHandler.swipeRight.next();
  }

  // Cleanup
  ngOnDestroy() {
    this.authSub.unsubscribe();
  }

}
