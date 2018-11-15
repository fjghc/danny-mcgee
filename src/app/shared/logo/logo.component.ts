import { Component, Input } from '@angular/core';

@Component({
  selector: 'dm-logo',
  templateUrl: './logo.component.html',
  styleUrls: ['./logo.component.scss']
})
export class LogoComponent {

  @Input() linked: boolean;

}
