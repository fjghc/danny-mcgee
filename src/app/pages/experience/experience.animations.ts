import { AnimationTriggerMetadata, query, stagger, state, style, transition, trigger } from '@angular/animations';
import { fadeIn, fadeOut } from '../../shared/animations';

export const timelineTransition: AnimationTriggerMetadata = trigger('timelineTransition', [
  transition('void => *', fadeIn)
]);

export const activeEmployerTransition: AnimationTriggerMetadata = trigger('activeEmployerTransition', [
  state('out', style({ opacity: 0 })),
  state('in', style({ opacity: 1 })),
  transition('in => out', fadeOut),
  transition('out => in', [
    style({ opacity: 1 }),
    query('section', style({ opacity: 0 }), { optional: true }),
    query('section', stagger(100, fadeIn), { optional: true })
  ])
]);
