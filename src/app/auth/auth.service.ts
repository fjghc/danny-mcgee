import * as firebase from 'firebase';
import { Injectable } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class AuthService {

  login(email: string, password: string) {
    firebase.auth().signInWithEmailAndPassword(email, password)
      .then((data) => console.log(data));
  }

}
