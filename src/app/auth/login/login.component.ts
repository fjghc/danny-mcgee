import { Component, OnInit } from '@angular/core';
import { FormGroup, Validators } from '@angular/forms';

import { faLock } from '@fortawesome/free-solid-svg-icons';

import { AuthService } from '../auth.service';

@Component({
  selector: 'dm-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {

  form: FormGroup;
  emailValidators = [Validators.required, Validators.email];
  passwordValidators = [Validators.required];

  icons = {
    lock: faLock
  };

  constructor(private authService: AuthService) {}

  ngOnInit() {
    this.form = new FormGroup({});
  }

  onSubmit() {
    this.authService.login(this.form.value.email, this.form.value.password, this.form.value.remember);
  }

}
