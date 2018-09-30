import { Component, HostBinding, Input, OnChanges, OnInit } from '@angular/core';
import { FormControl, FormGroup, NgForm, NgModel, ValidatorFn } from '@angular/forms';
import { isNullOrUndefined } from 'util';

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

  @HostBinding('class.focus') isFocused = false;
  @HostBinding('class.filled') isFilled = false;

  constructor() {}

  ngOnInit() {
    this.control = new FormControl(null, this.validators);
    this.form.addControl(this.id, this.control);

    // detect auto-filled values
    setTimeout(() => {
      if (this.control.value) {
        this.isFilled = true;
      }
    }, 50);
  }

  onFocus() {
    this.isFocused = true;
  }

  onBlur() {
    this.isFocused = false;
    this.control.value ? this.isFilled = true : this.isFilled = false;
  }
}
