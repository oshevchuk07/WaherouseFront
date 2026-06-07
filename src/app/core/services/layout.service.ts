import { Injectable, signal } from '@angular/core';

export interface LayoutConfig {
  topbarVisible: boolean;
  topbarTransparent: boolean;
  sidebarCollapsed: boolean;
}

const DEFAULT_CONFIG: LayoutConfig = {
  topbarVisible: true,
  topbarTransparent: false,
  sidebarCollapsed: false,
};

@Injectable({ providedIn: 'root' })
export class LayoutService {
  readonly config = signal<LayoutConfig>({ ...DEFAULT_CONFIG });

  set(patch: Partial<LayoutConfig>): void {
    this.config.update(c => ({ ...c, ...patch }));
  }

  reset(): void {
    this.config.set({ ...DEFAULT_CONFIG });
  }
}
