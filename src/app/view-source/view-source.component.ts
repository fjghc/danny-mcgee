import { Component, OnInit } from '@angular/core';
import { DeviceDetectorService } from 'ngx-device-detector';

@Component({
  selector: 'dm-view-source',
  templateUrl: './view-source.component.html',
  styleUrls: ['./view-source.component.scss']
})
export class ViewSourceComponent {

  constructor(public deviceDetector: DeviceDetectorService) {}

}
