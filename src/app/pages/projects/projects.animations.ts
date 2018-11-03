import {
  AnimationTriggerMetadata,
  animate,
  query,
  stagger,
  state,
  style,
  transition,
  trigger, group
} from '@angular/animations';
import { fadeIn, fadeInQuery, fadeOutQuery } from '../../shared/animations';
import { fadeConfig } from '../../shared/animations/animation.configs';

export const projectsTransition: AnimationTriggerMetadata = trigger('projectsTransition', [
  state('out', style({ opacity: 0 })),
  state('in', style({ opacity: 1 })),
  transition('out => in', [
    style({ opacity: 1 }),
    query('dm-project-item', style({ opacity: 0 }), { optional: true }),
    query('dm-project-item', stagger(100, fadeIn), { optional: true })
  ])
]);

export const projectModalTransition: AnimationTriggerMetadata = trigger('projectModalTransition', [
  state('out', style({ opacity: 0 })),
  state('in', style({ opacity: 1 })),
  transition('out => in', [
    style({ opacity: 1 }),
    group([
      query('.modal-backdrop', [
        style({ opacity: 0 }),
        animate(`${fadeConfig.delay}ms ${fadeConfig.easing}`, style({ opacity: 1 }))
      ]),
      fadeInQuery('dm-project-detail')
    ])
  ]),
  transition('in => out', [
    group([
      query('.modal-backdrop', [
        style({ opacity: 1 }),
        animate(`${fadeConfig.delay}ms ${fadeConfig.easing}`, style({ opacity: 0 }))
      ]),
      fadeOutQuery('dm-project-detail')
    ])
  ])
]);
