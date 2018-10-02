import { AfterViewInit, ChangeDetectorRef, Component, ElementRef, Input, OnInit, Renderer2 } from '@angular/core';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';

@Component({
  selector: 'dm-project-item',
  templateUrl: './project-item.component.html',
  styleUrls: ['./project-item.component.scss']
})
export class ProjectItemComponent implements OnInit {

  @Input() project;
  scaleFactor: number;
  timeout: number;
  bypassedUrl: SafeResourceUrl;

  constructor(
    private sanitizer: DomSanitizer,
    private element: ElementRef,
    private cd: ChangeDetectorRef
  ) {}

  ngOnInit() {
    this.bypassedUrl = this.sanitizer.bypassSecurityTrustResourceUrl(this.project.url);
  }

  // ngAfterViewInit() {
  //   this.calculateScale();
  //
  //   window.addEventListener('resize', () => {
  //     // clearTimeout(this.timeout);
  //     // this.timeout = setTimeout(this.calculateScale, 1000);
  //     this.calculateScale();
  //   });
  // }

  // getUrl() {
  //   return this.sanitizer.bypassSecurityTrustResourceUrl(this.project.url);
  // }

  // calculateScale() {
  //   const iframeWidth = 1366;
  //   const elemWidth = this.element.nativeElement.offsetWidth;
  //
  //   this.scaleFactor = elemWidth / iframeWidth;
  //   this.cd.detectChanges();
  // }

}
