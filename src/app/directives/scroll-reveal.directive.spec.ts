import { ElementRef } from '@angular/core';
import { ScrollRevealDirective } from './scroll-reveal.directive';

describe('ScrollRevealDirective', () => {
  it('should create an instance', () => {
    const mockEl = { nativeElement: document.createElement('div') };
    const directive = new ScrollRevealDirective(mockEl as ElementRef);
    expect(directive).toBeTruthy();
  });
});
