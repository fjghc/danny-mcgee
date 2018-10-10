import { Component, Input, OnInit } from '@angular/core';
import { File } from '../file.model';

@Component({
  selector: 'dm-filetree',
  templateUrl: './filetree.component.html',
  styleUrls: ['./filetree.component.scss']
})
export class FiletreeComponent implements OnInit {

  @Input() files: File[];

  constructor() { }

  ngOnInit() {
  }

}
