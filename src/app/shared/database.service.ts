import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
// import { AngularFireDatabase } from '@angular/fire/database';

@Injectable({ providedIn: 'root' })
export class DatabaseService {

  constructor(private afs: AngularFirestore) {}

  fetchCollection(path) {
    return this.afs.collection(path).valueChanges();
  }

}
