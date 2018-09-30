import { Component, Input, OnInit } from '@angular/core';
import { FormControl, FormGroup, NgForm, NgModel, ValidatorFn } from '@angular/forms';

@Component({
  selector: 'dm-input',
  host: { class: 'form-group' },
  templateUrl: './input.component.html',
  styleUrls: ['./input.component.scss']
})
export class InputComponent implements OnInit {

  @Input() label: string;
  @Input() id: string;
  @Input() type: string;
  @Input() validators: ValidatorFn[];
  @Input() form: FormGroup;
  control: FormControl;

  constructor() {}

  ngOnInit() {
    this.control = new FormControl(null, this.validators);
    this.form.addControl(this.id, this.control);
  }

}
