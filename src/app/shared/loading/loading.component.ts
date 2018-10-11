import { Component, OnInit } from '@angular/core';
import { faSpinner } from '@fortawesome/free-solid-svg-icons';

@Component({
  selector: 'dm-loading',
  templateUrl: './loading.component.html',
  styleUrls: ['./loading.component.scss']
})
export class LoadingComponent implements OnInit {

  icon = faSpinner;

  constructor() { }

  ngOnInit() {
  }

}
