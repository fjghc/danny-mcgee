import { NgModule } from '@angular/core';
import { HeaderComponent } from './header/header.component';
import { NavbarComponent } from './navbar/navbar.component';
import { SharedModule } from '../shared/shared.module';
import { AppRoutingModule } from '../app-routing.module';
import { MenuItemComponent } from './navbar/menu-item/menu-item.component';
import { LoginComponent } from './login/login.component';
import { DatabaseModule } from '../database/database.module';
import { FormComponentsModule } from '../form-components/form-components.module';
import * as Hammer from 'hammerjs';
import { HAMMER_GESTURE_CONFIG, HammerGestureConfig } from '@angular/platform-browser';

export class DmHammerConfig extends HammerGestureConfig {
  buildHammer(element: HTMLElement) {
    return new Hammer(element, {
      touchAction: 'pan-y'
    });
  }
}

@NgModule({
  declarations: [
    HeaderComponent,
    NavbarComponent,
    MenuItemComponent,
    LoginComponent,
  ],
  imports: [
    SharedModule,
    FormComponentsModule,
    DatabaseModule,
    AppRoutingModule
  ],
  exports: [
    AppRoutingModule,
    HeaderComponent,
    NavbarComponent
  ],
  providers: [{
    provide: HAMMER_GESTURE_CONFIG,
    useClass: DmHammerConfig
  }],
})
export class CoreModule {}
