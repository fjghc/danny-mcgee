import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';

@Injectable({ providedIn: 'root' })
export class AuthService {

  token: string = null;

  constructor(private afAuth: AngularFireAuth) {}

  login(email: string, password: string) {
    this.afAuth.auth.signInWithEmailAndPassword(email, password)
      .then(credential => {
        this.afAuth.auth.currentUser.getIdToken()
          .then(token => this.token = token);
      });
  }

  logout() {
    this.afAuth.auth.signOut();
  }

  async getToken() {
    return await this.afAuth.auth.currentUser.getIdToken();
  }

  isAuthenticated() {
    return this.token !== null;
  }
}
