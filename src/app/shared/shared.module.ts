import { NgModule } from '@angular/core';
import { LogoComponent } from './logo/logo.component';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { LoadingComponent } from './loading/loading.component';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { TooltipDirective } from './tooltip.directive';

@NgModule({
  declarations: [
    LogoComponent,
    LoadingComponent,
    TooltipDirective,
  ],
  imports: [
    CommonModule,
    RouterModule,
    FontAwesomeModule,
  ],
  exports: [
    CommonModule,
    FontAwesomeModule,
    LogoComponent,
    LoadingComponent,
    TooltipDirective,
  ]
})
export class SharedModule {}
