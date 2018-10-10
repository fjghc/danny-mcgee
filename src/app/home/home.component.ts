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
          name: 'test',
          type: 'folder',
          contents: [
            {
              name: 'test.js',
              type: 'javascript',
              storageRef: 'dannymcgee/src/js/test/test.js'
            }
          ]
        },
        {
          name: 'test.js',
          type: 'javascript',
          storageRef: 'dannymcgee/src/js/test.js'
        },
        {
          name: 'script.js',
          type: 'javascript',
          storageRef: 'dannymcgee/src/js/script.js'
        },
        {
          name: 'mock-data.ts',
          type: 'typescript',
          storageRef: 'dannymcgee/src/js/mock-data.ts'
        }
      ]
    },
    {
      name: 'index.html',
      type: 'htmlmixed',
      storageRef: 'dannymcgee/src/index.html'
    }
  ];

  constructor() {}

}
