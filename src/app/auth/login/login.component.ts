import { Component, OnInit } from '@angular/core';
import { FormGroup, Validators } from '@angular/forms';

import { faLockAlt } from '@fortawesome/pro-light-svg-icons';

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
    lock: faLockAlt
  };

  constructor(private authService: AuthService) {}

  ngOnInit() {
    this.form = new FormGroup({});
  }

  onSubmit() {
    console.log('form value:', this.form.value);
    this.authService.login(this.form.value.email, this.form.value.password, this.form.value.remember);
  }

}
