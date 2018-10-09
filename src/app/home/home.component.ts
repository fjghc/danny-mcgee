import { Component } from '@angular/core';
import { environment } from '../../environments/environment';

@Component({
  selector: 'dm-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent {

  baseUrl = 'gs://' + environment.firebase.storageBucket;
  files = [
    {
      name: 'css',
      type: 'folder',
      contents: [
        {
          name: 'another folder',
          type: 'folder',
          contents: [
            {
              name: 'styles.css',
              type: 'css',
              storageRef: 'dannymcgee/src/css/styles.css'
            },
            {
              name: 'styles.css',
              type: 'css',
              storageRef: 'dannymcgee/src/css/styles.css'
            },
          ]
        },
        {
          name: 'styles.css',
          type: 'css',
          storageRef: 'dannymcgee/src/css/styles.css'
        },
        {
          name: 'styles.css',
          type: 'css',
          storageRef: 'dannymcgee/src/css/styles.css'
        },
        {
          name: 'styles.css',
          type: 'css',
          storageRef: 'dannymcgee/src/css/styles.css'
        },
        {
          name: 'styles.css',
          type: 'css',
          storageRef: 'dannymcgee/src/css/styles.css'
        },
      ]
    },
    {
      name: 'js',
      type: 'folder',
      contents: [
        {
          name: 'script.js',
          type: 'javascript',
          storageRef: 'dannymcgee/src/js/script.js'
        }
      ]
    },
    {
      name: 'index.html',
      type: 'html',
      storageRef: 'dannymcgee/src/index.html'
    }
  ];

  constructor() {}

}
