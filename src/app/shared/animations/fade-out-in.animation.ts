import { AnimationMetadata, query, sequence, style } from '@angular/animations';
import { fadeConfig } from './animation.configs';
import { fadeOut } from './fade-out.animation';
import { fadeIn } from './fade-in.animation';

export function fadeOutIn(elem1Selector: string, elem2Selector?: string): AnimationMetadata {
  const initialStep: AnimationMetadata = elem2Selector ? query(
      elem2Selector,
      style({ position: 'fixed', transform: `translateY(${fadeConfig.distance})`, opacity: 0 }),
      { optional: true }
    ) : null;

  const middleStep: AnimationMetadata = elem2Selector ? query(
    elem2Selector,
    style({ position: 'relative', transform: `translateY(${fadeConfig.distance})` }),
    { optional: true }
  ) : null;

  return sequence([
    initialStep ? initialStep : null,
    fadeOut(elem1Selector),
    middleStep ? middleStep : null,
    fadeIn(elem2Selector ? elem2Selector : elem1Selector)
  ]);
}
