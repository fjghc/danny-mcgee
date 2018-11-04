import { AnimationMetadata, query, sequence, style } from '@angular/animations';
import { fadeConfig } from './animation.configs';
import { fadeOutQuery } from './fade-out.animation';
import { fadeInQuery } from './fade-in.animation';

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
    fadeInQuery(elem2Selector)
  ]);
}
