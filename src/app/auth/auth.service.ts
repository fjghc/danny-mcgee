import { Injectable } from '@angular/core';
import { Router } from '@angular/router';

import * as firebase from 'firebase';
import { AngularFireAuth } from '@angular/fire/auth';

@Injectable({ providedIn: 'root' })
export class AuthService {

  token: string = null;

  constructor(
    private afAuth: AngularFireAuth,
    private router: Router
  ) {}

  login(email: string, password: string, remember?: boolean) {
    if (!remember) {
      this.afAuth.auth.setPersistence(firebase.auth.Auth.Persistence.SESSION)
        .then(response => {
          console.log('response:', response);

          this.loginSetTokenAndRedirect(email, password);
        });
    } else {
      this.loginSetTokenAndRedirect(email, password);
    }
  }

  logout() {
    this.afAuth.auth.signOut()
      .then(response => {
        this.token = null;
      });
  }

  isAuthenticated() {
    return this.token !== null;
  }

  getToken() {
    return this.token;
  }

  setAuthenticationStatus() {
    if (this.afAuth.auth.currentUser) {
      this.afAuth.auth.currentUser.getIdToken()
        .then(token => {
          this.token = token;
          console.log('token:', token);
        })
        .catch(error => {
          this.token = null;
          console.log('No token found!', error);
        });
    } else {
      console.log('no current user!');
      this.token = null;
    }
  }

  listenForAuthChanges() {
    return this.afAuth.authState;
  }

  private loginSetTokenAndRedirect(email: string, password: string) {
    this.afAuth.auth.signInWithEmailAndPassword(email, password)
      .then(credential => {
        this.afAuth.auth.currentUser.getIdToken()
          .then(token => this.token = token);

        this.router.navigate(['/']);
      });
  }
}
