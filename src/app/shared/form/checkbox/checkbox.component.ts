import { Component, HostBinding, Input, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';

@Component({
  selector: 'dm-checkbox',
  host: { class: 'checkbox' },
  templateUrl: './checkbox.component.html',
  styleUrls: ['./checkbox.component.scss']
})
export class CheckboxComponent implements OnInit {

  @Input() label: string;
  @Input() id: string;
  @Input() form: FormGroup;
  control: FormControl;

  @HostBinding('class.checked') isChecked = false;
  @HostBinding('class.focus') isFocused = false;

  constructor() { }

  ngOnInit() {
    this.control = new FormControl(null);
    this.form.addControl(this.id, this.control);
  }

  onChanged() {
    this.control.value ? this.isChecked = true : this.isChecked = false;
    console.log('onChanged called! value is ' + this.control.value);
  }

  onFocus() {
    this.isFocused = true;
  }

  onBlur() {
    this.isFocused = false;
  }
}
