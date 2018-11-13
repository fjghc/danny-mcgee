// Angular imports
import { Component, HostListener, OnDestroy, OnInit, Renderer2 } from '@angular/core';

// Dependency imports
import { Subscription } from 'rxjs';
import { DeviceDetectorService } from 'ngx-device-detector';

// App imports
import { AuthService } from './shared/auth.service';
import { GestureHandler } from './core/gesture-handler.service';
import { RouterOutlet } from '@angular/router';
import { fadeConfig } from './shared/animations';
import { routerTransition, routerTransitionFallback, headerInTransition, navInTransition } from './core/core.animations';

// Component config
@Component({
  selector: 'dm-root',
  animations: [routerTransition, routerTransitionFallback, navInTransition, headerInTransition],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit, OnDestroy {

  // Data
  browser: string;

  // Subs
  authSub: Subscription;

  // Services
  constructor(
    private authService: AuthService,
    private renderer: Renderer2,
    public deviceDetector: DeviceDetectorService,
    public gestureHandler: GestureHandler
  ) {}

  // Init
  ngOnInit() {
    this.authSub = this.authService.listenForAuthChanges().subscribe(
      () => this.authService.setAuthenticationStatus()
    );
    this.browser = this.deviceDetector.getDeviceInfo().browser;
    this.renderer.addClass(document.body, this.browser);
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

  onRouterTransitionStart($event) {
    // Edge and IE don't seem to correctly handle query steps in an Angular animation sequence,
    // so we need to manually hide the entering node until it's ready to show
    const childNodes = $event.element.childNodes;

    if (childNodes.length === 3) {
      // if childNodes.length is more than 2, there's a leaving node which needs to fade out
      // before the entering node should start to fade in, so hide the entering node
      const entering = childNodes[1];
      const leaving = childNodes[2];
      this.renderer.addClass(entering, 'animation-state-hidden');

      setTimeout(() => {
        // after the leaving node has finished fading out, hide it and unhide the entering node
        this.renderer.removeClass(entering, 'animation-state-hidden');
        this.renderer.addClass(leaving, 'animation-state-hidden');
      }, fadeConfig.delay);
    }
  }

  // Cleanup
  ngOnDestroy() {
    this.authSub.unsubscribe();
  }

}
