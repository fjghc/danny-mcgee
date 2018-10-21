import { AfterViewInit, Component, ElementRef, HostBinding, Input, OnInit,  } from '@angular/core';
import { FormControl, FormGroup, ValidatorFn } from '@angular/forms';

@Component({
  selector: 'dm-input',
  host: { class: 'form-group' },
  templateUrl: './input.component.html',
  styleUrls: ['./input.component.scss']
})
export class InputComponent implements OnInit, AfterViewInit {

  @Input() label: string;
  @Input() id: string;
  @Input() type: string;
  @Input() validators: ValidatorFn[];
  @Input() form: FormGroup;
  control: FormControl;

  @HostBinding('class.filled') isFilled = false;
  @HostBinding('class.focus') isFocused = false;

  constructor(private element: ElementRef) {}

  ngOnInit() {
    this.control = new FormControl(null, this.validators);
    this.form.addControl(this.id, this.control);
  }

  ngAfterViewInit() {
    setTimeout(() => {
      // check for autofilled values (works in Firefox)
      if (this.control.value) {
        this.isFilled = true;
      }

      // check for Chrome autofill
      try {
        if (this.element.nativeElement.querySelector('input:-webkit-autofill')) {
          this.isFilled = true;
        }
      } catch (e) {}
    }, 200);
  }

  onFocus() {
    this.isFocused = true;
  }

  onBlur() {
    this.isFocused = false;
    this.control.value ? this.isFilled = true : this.isFilled = false;
  }

  // textareaResize($event) {
  //   const elem = $event.srcElement;
  //   setTimeout(() => {
  //     elem.style = `height: ${elem.scrollHeight}px`;
  //   });
  // }
}
