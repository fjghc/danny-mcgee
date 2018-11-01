import { Component, OnInit } from '@angular/core';
import { FormGroup, Validators } from '@angular/forms';

import { faLockAlt } from '@fortawesome/pro-light-svg-icons';

import { AuthService } from '../../../shared/auth.service';

@Component({
  selector: 'dm-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {

  form: FormGroup;
  validators = {
    required: Validators.required,
    email: Validators.email
  };

  icons = {
    lock: faLockAlt
  };

  constructor(private authService: AuthService) {}

  ngOnInit() {
    this.form = new FormGroup({});
  }

  onSubmit() {
    this.authService.login(this.form.value.email, this.form.value.password, this.form.value.remember);
  }

}
