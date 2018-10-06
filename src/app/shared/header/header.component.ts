import { Component, OnDestroy, OnInit } from '@angular/core';
import { Router, RoutesRecognized } from '@angular/router';
import { AuthService } from '../../auth/auth.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'dm-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit, OnDestroy {

  urlTitleLookup = {
    '/': 'Home',
    '/projects': 'Projects',
    '/login': 'Login'
  };
  pageTitle: string;
  subscription: Subscription;

  constructor(
    public authService: AuthService,
    private router: Router
  ) { }

  ngOnInit() {
    this.subscription = this.router.events.subscribe(
      event => {
        if (event instanceof RoutesRecognized) {
          const url = event.url.toString();

          if (this.urlTitleLookup[url]) {
            this.pageTitle = this.urlTitleLookup[url];
          }
        }
      }
    );
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }

}
