// Angular imports
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

// Dependency imports
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { AngularFirestore } from '@angular/fire/firestore';
import { AngularFireDatabase } from '@angular/fire/database';
import { AngularFireStorage } from '@angular/fire/storage';

// Service config
@Injectable({ providedIn: 'root' })
export class DataHandler {

  // Services
  constructor(
    private afs: AngularFirestore,
    private rtdb: AngularFireDatabase,
    private storage: AngularFireStorage,
    private http: HttpClient
  ) {}

  // Firebase Cloud Firestore methods
  watchCollection(path: string): Observable<any> {
    return this.afs.collection(path, ref => ref.orderBy('order')).valueChanges();
  }

  addDocument(collection: string, document: string, content: {}) {
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

  // Firebase Realtime Database methods
  watchList(path: string): Observable<any[]> {
    return this.rtdb.list(path).valueChanges();
  }

  // Firebase Storage methods
  private getDownloadUrlForRef(ref: string): Observable<string> {
    return this.storage.ref(ref).getDownloadURL();
  }

  // HTTP methods
  readFile(refOrUrl: string): Promise<string> {
    // console.log('ref received: ' + refOrUrl);
    // test whether this is a reference or URL
    const regex = RegExp(/^(http(s)?:\/\/).*$/);

    if (!regex.test(refOrUrl)) {
      // console.log('ref is NOT a URL');
      // This is NOT a URL, so resolve the reference with Firebase Storage
      return new Promise((resolve, reject) => {
        this.getDownloadUrlForRef(refOrUrl).toPromise()
          .then(downloadUrl => {
            // console.log('resolved URL: ' + downloadUrl);
            this.getFileAsText(downloadUrl)
              .then(content => {
                resolve(content);
              })
              .catch(error => {
                // console.log('ERROR: Could not read file', error);
                reject(error);
              });
          })
          .catch(error => {
            // console.log('ERROR: Could not get download URL', error);
            reject(error);
          });
      });
    } else {
      // this is already a URL, so get the file contents
      return this.getFileAsText(refOrUrl);
    }
  }

  private getFileAsText(url: string): Promise<string> {
    return this.http.get(url, { responseType: 'text' })
      .pipe(
        tap(
          data => data,
          error => console.log(url, error)
        )
      )
      .toPromise();
  }

}
