import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class DatabaseService {

  constructor(private afs: AngularFirestore) {}

  fetchCollection(path: string): Observable<any> {
    return this.afs.collection(path, ref => ref.orderBy('order')).valueChanges();
  }

  setDocument(collection: string, document: string, content: {}) {
    this.afs.collection(collection).doc(document).set(content)
      .then(() => {
        console.log(`${collection}/${document} set with content:`);
        console.table(content);
      });
  }

  updateDocument(collection: string, document: string, content: {}) {
    this.afs.collection(collection).doc(document).update(content)
      .then(() => {
        console.log(`${collection}/${document} updated with content:`);
        console.table(content);
      });
  }

}
