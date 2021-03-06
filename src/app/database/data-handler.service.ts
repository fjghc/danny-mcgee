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

  getSubCollection(collection: string, document: string, subCollection: string): Promise<any> {
    return new Promise((resolve, reject) => {
      const requested = this.afs.collection(collection).doc(document).collection(subCollection);
      const sub = requested.valueChanges().subscribe(
        response => {
          if (response.length > 0) {
            resolve(response);
            sub.unsubscribe();
          } else {
            reject(`No items found for subcollection ${subCollection}`);
            sub.unsubscribe();
          }
        },
        error => {
          reject(`ERROR fetching subcollection ${subCollection}: ` + error);
          sub.unsubscribe();
        }
      );
    });
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

  uploadFilesMapForProject(projectId: string, filesMap: any[]): Promise<any> {
    const list = this.rtdb.list('filesMap/');
    return list.set(projectId, filesMap);
  }

  // Firebase Storage methods
  private getDownloadUrlForRef(ref: string): Observable<string> {
    return this.storage.ref(ref).getDownloadURL();
  }

  uploadFileToStorage(file: File, path: string): Promise<any> {
    const task = this.storage.upload(path, file);
    return new Promise((resolve, reject) => {
      task.percentageChanges().subscribe(
        value => console.log('Uploading file: ' + value + '%'),
        error => reject(error),
        () => resolve('File uploaded successfully!')
      );
    });
  }

  deleteFileFromStorage(path: string): Promise<any> {
    const task = this.storage.ref(path).delete();
    return new Promise((resolve, reject) => {
      task.subscribe(
        () => {},
        error => reject(error),
        () => resolve('File deleted successfully!')
      );
    });
  }

  // HTTP methods
  readFile(refOrUrl: string): Promise<string> {
    // test whether this is a reference or URL
    const regex = RegExp(/^(http(s)?:\/\/).*$/);

    if (!regex.test(refOrUrl)) {
      // this is NOT a URL, so resolve the reference with Firebase Storage
      return new Promise((resolve, reject) => {
        this.getDownloadUrlForRef(refOrUrl).toPromise()
          .then(downloadUrl => {
            this.getFileAsText(downloadUrl)
              .then(content => {
                resolve(content);
              })
              .catch(error => {
                reject(error);
              });
          })
          .catch(error => {
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
