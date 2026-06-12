import { Component, input, computed } from '@angular/core';

@Component({
  selector: 'app-icon',
  standalone: true,
  template: `
    <svg [attr.width]="size()" [attr.height]="size()" class="inline-block shrink-0 fill-none" [class]="cssClass()" aria-hidden="true">
      <use [attr.href]="href()" />
    </svg>
  `,
})
export class IconComponent {
  name = input.required<string>();
  size = input<number>(24);
  cssClass = input<string>('');

  href = computed(() => `/sprite.svg#icon-${this.name()}`);
}
