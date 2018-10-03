import { Component, OnInit } from '@angular/core';
import { AuthService } from '../auth/auth.service';

@Component({
  selector: 'dm-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {

  monacoOptions = {
    theme: 'vs-dark',
    language: 'typescript'
  };
  code = 'function x() {\nconsole.log("Hello world!");\n}';

  constructor(private authService: AuthService) {}

  ngOnInit() {}

  onGetToken = () => console.log(this.authService.getToken());

}
