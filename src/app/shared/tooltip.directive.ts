// Angular imports
import {
  AfterViewInit,
  Directive,
  ElementRef,
  HostBinding,
  HostListener,
  Input,
  OnInit,
  Renderer2
} from '@angular/core';

// Directive config
@Directive({
  selector: '[dmTooltip]'
})
export class TooltipDirective implements OnInit, AfterViewInit {

  // Services
  constructor(
    private elem: ElementRef,
    private renderer: Renderer2
  ) {}

  // Data
  @Input() dmTooltip: string;
  @HostBinding('class.tooltip-container') hostClass = true;
  tooltipElem: HTMLElement;
  tooltipArrow: HTMLElement;

  // Init
  ngOnInit() {
    this.createElements();
  }

  ngAfterViewInit() {
    this.keepOnScreen();
  }

  // DOM manipulation
  createElements() {
    this.tooltipElem = this.renderer.createElement('span');
    this.tooltipArrow = this.renderer.createElement('b');
    const content = this.renderer.createText(this.dmTooltip);

    this.renderer.appendChild(this.elem.nativeElement, this.tooltipElem);
    this.renderer.addClass(this.tooltipElem, 'tooltip');
    this.renderer.appendChild(this.tooltipElem, content);
    this.renderer.appendChild(this.tooltipElem, this.tooltipArrow);
    this.renderer.addClass(this.tooltipArrow, 'arrow');
  }

  keepOnScreen() {
    const rect = this.tooltipElem.getBoundingClientRect() as DOMRect;

    if (rect.x < 0) {
      this.renderer.setStyle(
        this.tooltipElem,
        'transform',
        `translateX(calc(-50% + ${Math.abs(rect.x)}px)) translateY(calc(-100% - 8px))`
      );
      this.renderer.setStyle(
        this.tooltipArrow,
        'transform',
        `translateX(calc(-50% - ${Math.abs(rect.x)}px))`
      );
    }
  }

  // Events
  @HostListener('mouseenter') onMouseEnter() {
    this.renderer.addClass(this.tooltipElem, 'shown');
  }

  @HostListener('mouseleave') onMouseLeave() {
    this.renderer.removeClass(this.tooltipElem, 'shown');
  }

}
