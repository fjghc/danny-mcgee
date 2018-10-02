import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router, RoutesRecognized } from '@angular/router';
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
    private router: Router,
    private route: ActivatedRoute
  ) { }

  ngOnInit() {
    this.router.events.subscribe(
      event => {
        if (event instanceof RoutesRecognized) {
          console.log(event.url.toString());
          this.pageTitle = this.urlTitleLookup[event.url.toString()];
        }
      }
    );
  }

  onNewProject() {
    this.router.navigate(['/new'], { relativeTo: this.route });
  }

  onEditProjects() {

  }

}
