import { Component, OnInit } from '@angular/core';
import { faSpinnerThird } from '@fortawesome/pro-light-svg-icons';

@Component({
  selector: 'dm-loading',
  templateUrl: './loading.component.html',
  styleUrls: ['./loading.component.scss']
})
export class LoadingComponent implements OnInit {

  icon = faSpinnerThird;

  constructor() { }

  ngOnInit() {
  }

}
