import { AnimationMetadata, animate, query, style } from '@angular/animations';
import { fadeConfig } from './animation.configs';

export function fadeIn(selector: string): AnimationMetadata {
  return query(selector, [
    style({ transform: `translateY(${fadeConfig.distance})`, opacity: 0 }),
    animate(`${fadeConfig.delay}ms ${fadeConfig.easing}`, style({ transform: 'translateY(0)', opacity: 1 }))
  ], { optional: true });
}
