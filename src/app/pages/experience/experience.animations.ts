import { AnimationTriggerMetadata, query, stagger, state, style, transition, trigger } from '@angular/animations';
import { fadeIn, fadeOut, fadeOutQuery } from '../../shared/animations';

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


  // state('in', style({ transform: `translateY(0)`, opacity: 1 })),
  // state('out', style({ transform: `translateY(${fadeConfig.distance}px)`, opacity: 0 })),
  // transition('in => out', animate(fadeConfig.delay)),
  // transition('out => in', [
  //   query('section', style({ opacity: 0 }), { optional: true }),
  //   query('section', stagger(100, fadeIn), { optional: true })
  // ]),
]);
