import { AnimationTriggerMetadata, animate, state, style, transition, trigger } from '@angular/animations';

export const navInTransition: AnimationTriggerMetadata = trigger('navInTransition', [
  transition('void => *', [
    style({ transform: 'translateX(-64px)' }),
    animate('250ms ease-in-out', style({ transform: 'translateX(0)' }))
  ])
]);

export const headerInTransition: AnimationTriggerMetadata = trigger('headerInTransition', [
  transition('void => *', [
    style({ transform: 'translateY(-94px)' }),
    animate('250ms ease-in-out', style({ transform: 'translateY(0)' }))
  ])
]);
