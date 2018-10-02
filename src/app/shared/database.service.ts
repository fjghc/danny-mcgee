import { Injectable } from '@angular/core';
import { AngularFireDatabase } from '@angular/fire/database';

@Injectable({ providedIn: 'root' })
export class DatabaseService {

  constructor(private db: AngularFireDatabase) {}

  fetchData(pathOrRef) {
    return this.db.list(pathOrRef).valueChanges();
  }

}
