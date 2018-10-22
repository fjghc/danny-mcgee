// Angular imports
import { Component, OnInit } from '@angular/core';
import { FormGroup, Validators } from '@angular/forms';
import { HttpClient, HttpHeaders } from '@angular/common/http';

// Dependency imports
import { faEnvelope } from '@fortawesome/pro-light-svg-icons';
import { faCheck, faTimes } from '@fortawesome/pro-solid-svg-icons';

// Component config
@Component({
  selector: 'dm-contact',
  templateUrl: './contact.component.html',
  styleUrls: ['./contact.component.scss']
})
export class ContactComponent implements OnInit {

  // Data
  form: FormGroup;
  validators = {
    required: Validators.required
  };
  icons = {
    mail: faEnvelope,
    sent: faCheck,
    error: faTimes
  };

  // State
  contactInfoType: 'email' | 'phone' | 'other' = null;
  status: 'default' | 'sending' | 'sent' | 'error' = 'default';

  // Services
  constructor(private http: HttpClient) {}

  // Init
  ngOnInit() {
    this.form = new FormGroup({});
  }

  // Events
  onSubmit() {
    this.status = 'sending';

    const fromEmail = this.contactInfoType === 'email' ? this.form.value.contactInfo : 'dannymcgee.io@gmail.com';
    const emailContent = `<p><b>Name:</b><br /> ${this.form.value.name}</p>`
      + `<p><b>Contact Info:</b><br /> ${this.form.value.contactInfo}</p>`
      + `<p><b>Message:</b><br />${this.form.value.message}</p>`;

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

    return this.http.post(url, body, httpOptions).toPromise()
      .then(response => {
        this.status = 'sent';
      })
      .catch(error => {
        this.status = 'error';
      });
  }

}
