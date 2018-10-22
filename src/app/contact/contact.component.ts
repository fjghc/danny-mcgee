import { Component, OnInit } from '@angular/core';
import { FormGroup, Validators } from '@angular/forms';
import { HttpClient, HttpHeaders } from '@angular/common/http';

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
  contactInfoType: 'email' | 'phone' | 'other' = null;

  constructor(private httpClient: HttpClient) {}

  ngOnInit() {
    this.form = new FormGroup({});
  }

  onSubmit() {
    console.log(this.form.value);

    const fromEmail = this.contactInfoType === 'email' ? this.form.value.contactInfo : 'dannymcgee.io@gmail.com';
    const emailContent = `<p><b>Name:</b><br /> ${this.form.value.name}</p>`
      + `<p><b>Contact Info:</b><br /> ${this.form.value.contactInfo}</p>`
      + `<p><b>Message:</b><br />${this.form.value.message}</p>`;

    console.log('Email body:', emailContent);

    const url = 'https://us-central1-danny-mcgee.cloudfunctions.net/sendMail';
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*'
      })
    };

    const body = JSON.stringify({
      to: 'dannymcgee@gmail.com',
      from: `"${this.form.value.name}" <${fromEmail}>`,
      subject: 'New message from dannymcgee.io Contact form',
      text: '',
      html: emailContent
    });

    return this.httpClient.post(url, body, httpOptions).toPromise()
      .then(response => console.log(response))
      .catch(error => console.log('ERROR calling cloud function:', error));
  }

}
