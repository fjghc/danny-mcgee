import { Component, OnInit } from '@angular/core';
import { Router, RoutesRecognized } from '@angular/router';
import { AuthService } from '../../auth/auth.service';

@Component({
  selector: 'dm-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit {

  urlTitleLookup = {
    '/': 'Home',
    '/projects': 'Projects',
    '/login': 'Login'
  };
  pageTitle: string;

  constructor(
    public authService: AuthService,
    private router: Router
  ) { }

  ngOnInit() {
    this.router.events.subscribe(
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

}
