import { Injectable } from '@angular/core';
import { Router } from '@angular/router';

import * as firebase from 'firebase';
import { AngularFireAuth } from '@angular/fire/auth';
import { ProjectsService } from '../pages/projects/projects.service';

@Injectable({ providedIn: 'root' })
export class AuthService {

  token: string = null;

  constructor(
    private afAuth: AngularFireAuth,
    private router: Router,
    private projectsService: ProjectsService
  ) {}

  login(email: string, password: string, remember?: boolean) {
    if (!remember) {
      this.afAuth.auth.setPersistence(firebase.auth.Auth.Persistence.SESSION)
        .then(() => {
          this.loginSetTokenAndRedirect(email, password);
        });
    } else {
      this.loginSetTokenAndRedirect(email, password);
    }
  }

  logout() {
    this.afAuth.auth.signOut()
      .then(() => {
        this.token = null;
        this.projectsService.editMode.next(false);
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
        })
        .catch(error => {
          this.token = null;
          console.log('ERROR: ' + error);
        });
    } else {
      this.token = null;
    }
  }

  listenForAuthChanges() {
    return this.afAuth.authState;
  }

  private loginSetTokenAndRedirect(email: string, password: string) {
    this.afAuth.auth.signInWithEmailAndPassword(email, password)
      .then(() => {
        this.afAuth.auth.currentUser.getIdToken()
          .then(token => this.token = token);

        this.router.navigate(['/']);
      });
  }
}