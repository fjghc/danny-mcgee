import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';

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

  constructor(private authService: AuthService) {}

  ngOnInit() {
    this.form = new FormGroup({});
  }

  onSubmit() {
    this.authService.login(this.form.value.email, this.form.value.password);
  }

}
