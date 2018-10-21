import { Component, OnInit } from '@angular/core';
import { FormGroup, Validators } from '@angular/forms';

import { faEnvelope } from '@fortawesome/pro-light-svg-icons';

@Component({
  selector: 'dm-contact',
  templateUrl: './contact.component.html',
  styleUrls: ['./contact.component.scss']
})
export class ContactComponent implements OnInit {

  form: FormGroup;
  validators = {
    required: Validators.required
  };
  icons = {
    mail: faEnvelope
  };

  constructor() {}

  ngOnInit() {
    this.form = new FormGroup({});
  }

  onSubmit() {
    console.log(this.form.value);
  }

}
