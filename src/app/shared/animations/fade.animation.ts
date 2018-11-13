import { animate, AnimationMetadata, query, sequence, style } from '@angular/animations';
import { fadeConfig } from './animation.config';


// Fade in

export const fadeIn = [
  style({ transform: `translateY(${fadeConfig.distance})`, opacity: 0 }),
  animate(`${fadeConfig.delay}ms ${fadeConfig.easing}`, style({ transform: 'translateY(0)', opacity: 1 }))
];

export function fadeInQuery(selector: string): AnimationMetadata {
  return query(selector, fadeIn, { optional: true });
}


// Fade out

export const fadeOut = [
  style({ transform: 'translateY(0)', opacity: 1 }),
  animate(`${fadeConfig.delay}ms ${fadeConfig.easing}`, style({ transform: `translateY(${fadeConfig.distance})`, opacity: 0 }))
];

export function fadeOutQuery(selector: string): AnimationMetadata {
  return query(selector, fadeOut, { optional: true });
}


// Fade out then fade in

export function fadeOutIn(elem1Selector: string, elem2Selector: string): AnimationMetadata {
  return sequence([
    query(
      elem2Selector,
      style({ position: 'fixed', transform: `translateY(${fadeConfig.distance})`, opacity: 0 }),
      { optional: true }
    ),
    fadeOutQuery(elem1Selector),
    query(
      elem2Selector,
      style({ position: 'relative', transform: `translateY(${fadeConfig.distance})` }),
      { optional: true }
    ),
    query(
      elem1Selector,
      style({ height: 0, overflow: 'hidden' }),
      { optional: true }
    ),
    fadeInQuery(elem2Selector)
  ]);
}

export function fadeOutInFallback(elem1Selector: string, elem2Selector: string): AnimationMetadata {
  return sequence([
    fadeOutQuery(elem1Selector),
    fadeInQuery(elem2Selector)
  ]);
}
