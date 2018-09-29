import { Directive, HostBinding, HostListener, Renderer2 } from '@angular/core';

@Directive({
  selector: '[dmDropdown]'
})
export class DropdownDirective {

  @HostBinding('class.open') isOpen = false;
  @HostListener('click') onClick = () => this.toggle();

  constructor(private renderer: Renderer2) {}

  toggle() {
    this.isOpen = !this.isOpen;

    if (this.isOpen) {
      // wait 20ms to skip this button click
      setTimeout(() => {
        // clicking anywhere should now close the dropdown
        const listenerFn = this.renderer.listen('document', 'click', (event) => {
          this.close();
          // call the listener function again to stop listening
          listenerFn();
        });
      }, 20);
    }
  }

  close() {
    this.isOpen = false;
  }

}
