import { AnimationMetadata, animate, query, style, animateChild } from '@angular/animations';
import { fadeConfig } from './animation.configs';

export const fadeIn = [
  style({ transform: `translateY(${fadeConfig.distance})`, opacity: 0 }),
  animate(`${fadeConfig.delay}ms ${fadeConfig.easing}`, style({ transform: 'translateY(0)', opacity: 1 }))
];

export function fadeInQuery(selector: string): AnimationMetadata {
  return query(selector, fadeIn, { optional: true });
}
