import {
  animate,
  AnimationTriggerMetadata,
  query,
  sequence,
  state,
  style,
  transition,
  trigger
} from '@angular/animations';
import { fadeConfig, fadeOutIn, fadeOutInFallback, fadeOutQuery } from '../shared/animations';

export const routerTransition: AnimationTriggerMetadata = trigger('routerTransition', [
  transition('* => home, * => skills, * => contact, * => view-source, * => not-found', [
    fadeOutIn(':leave', ':enter')
  ]),
  transition('* => experience, * => projects', [
    sequence([
      query(':enter', style({ position: 'fixed', opacity: 0 }), { optional: true }),
      fadeOutQuery(':leave'),
      query(':enter', style({ position: 'relative', opacity: 1 }), { optional: true })
    ])
  ])
]);

export const routerTransitionFallback: AnimationTriggerMetadata = trigger('routerTransitionFallback', [
  transition('* => home, * => skills, * => contact, * => view-source', [
    fadeOutInFallback(':leave', ':enter')
  ]),
  transition('* => experience, * => projects', [
    sequence([
      query(':enter', style({ position: 'fixed', opacity: 0 }), { optional: true }),
      fadeOutQuery(':leave'),
      query(':enter', style({ position: 'relative', opacity: 1 }), { optional: true })
    ])
  ])
]);

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

export const headerTitleTransition: AnimationTriggerMetadata = trigger('headerTitleTransition', [
  state('in', style({ opacity: 1 })),
  state('out', style({ opacity: 0 })),
  transition('in <=> out', animate(`${fadeConfig.delay}ms ${fadeConfig.easing}`))
]);
