// Angular imports
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';

// Dependency imports
import * as firebase from 'firebase';
import { AngularFireAuth } from '@angular/fire/auth';

// App imports
import { ProjectsService } from '../pages/projects/projects.service';

// Service config
@Injectable({ providedIn: 'root' })
export class AuthService {

  // State
  token: string = null;

  // Services
  constructor(
    private afAuth: AngularFireAuth,
    private router: Router,
    private projectsService: ProjectsService
  ) {}

  // Getters
  isAuthenticated() {
    return this.token !== null;
  }

  listenForAuthChanges() {
    return this.afAuth.authState;
  }

  // State manipulation
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

  private loginSetTokenAndRedirect(email: string, password: string) {
    this.afAuth.auth.signInWithEmailAndPassword(email, password)
      .then(() => {
        this.afAuth.auth.currentUser.getIdToken()
          .then(token => this.token = token);

        this.router.navigate(['/']);
      });
  }
}
