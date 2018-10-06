import { Component, OnDestroy, OnInit } from '@angular/core';
import { AuthService } from './auth/auth.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'dm-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit, OnDestroy {

  subscription: Subscription;

  constructor(private authService: AuthService) {}

  ngOnInit() {
    this.subscription = this.authService.listenForAuthChanges().subscribe(
      () => {
        this.authService.setAuthenticationStatus();
      }
    );
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }

}
