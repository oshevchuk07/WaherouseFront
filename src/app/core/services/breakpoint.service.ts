import { Injectable, signal, inject } from '@angular/core';
import { DOCUMENT } from '@angular/common';

export type Breakpoint = 'mobile' | 'tablet' | 'desktop';

@Injectable({ providedIn: 'root' })
export class BreakpointService {
  private readonly window = inject(DOCUMENT).defaultView!;

  readonly breakpoint = signal<Breakpoint>(this.resolve());
  readonly isMobile = signal(this.resolve() === 'mobile');
  readonly isTablet = signal(this.resolve() === 'tablet');
  readonly isDesktop = signal(this.resolve() === 'desktop');

  constructor() {
    const observer = new ResizeObserver(() => this.update());
    observer.observe(inject(DOCUMENT).documentElement);
  }

  private resolve(): Breakpoint {
    const w = this.window.innerWidth;
    if (w < 768) return 'mobile';
    if (w < 1024) return 'tablet';
    return 'desktop';
  }

  private update(): void {
    const bp = this.resolve();
    this.breakpoint.set(bp);
    this.isMobile.set(bp === 'mobile');
    this.isTablet.set(bp === 'tablet');
    this.isDesktop.set(bp === 'desktop');
  }
}