import { AnimationMetadata, animate, query, style } from '@angular/animations';
import { fadeConfig } from './animation.configs';

export const fadeOut = [
  style({ transform: 'translateY(0)', opacity: 1 }),
  animate(`${fadeConfig.delay}ms ${fadeConfig.easing}`, style({ transform: `translateY(${fadeConfig.distance})`, opacity: 0 }))
];

export function fadeOutQuery(selector: string): AnimationMetadata {
  return query(selector, fadeOut, { optional: true });
}
