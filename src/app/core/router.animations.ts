import { AnimationTriggerMetadata, query, sequence, style, transition, trigger } from '@angular/animations';
import { fadeOut, fadeOutIn } from '../shared/animations';

export const routerTransition: AnimationTriggerMetadata = trigger('routerTransition', [
  transition('* => home, * => skills, * => contact, * => view-source', [
    fadeOutIn(':leave', ':enter')
  ]),
  transition('* => experience, * => projects', [
    sequence([
      query(':enter', style({ position: 'fixed', opacity: 0 }), { optional: true }),
      fadeOut(':leave'),
      query(':enter', style({ position: 'relative', opacity: 1 }), { optional: true })
    ])
  ])
]);
