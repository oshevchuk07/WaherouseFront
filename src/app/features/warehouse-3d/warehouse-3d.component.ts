import { Component, inject } from '@angular/core';
import type { SafeResourceUrl } from '@angular/platform-browser';
import { DomSanitizer } from '@angular/platform-browser';

@Component({
  templateUrl: './warehouse-3d.component.html',
})
export class Warehouse3dComponent {
  private demoUrl = 'https://oshevchuk.vercel.app/warehouse3d';
  private sanitizer = inject(DomSanitizer);
  warehouseUrl: SafeResourceUrl = this.sanitizer.bypassSecurityTrustResourceUrl(this.demoUrl);
}
