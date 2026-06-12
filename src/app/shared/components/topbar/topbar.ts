import { Component, input, inject, output } from '@angular/core';
import type { AuthUser } from '../../../core/models/user.model';
import { ThemeService } from '../../../core/services/theme.service';
import { IconComponent } from '../icons/icons.component';

@Component({
  selector: 'app-topbar',
  standalone: true,
  template: `
    <header
      class="h-14 flex items-center gap-3 px-4 shrink-0 transition-all duration-200 z-10"
      [class.bg-white]="!transparent()"
      [class.dark:bg-gray-900]="!transparent()"
      [class.border-b]="!transparent()"
      [class.border-gray-200]="!transparent()"
      [class.dark:border-gray-800]="!transparent()"
      [class.bg-transparent]="transparent()"
      [class.absolute]="transparent()"
      [class.top-0]="transparent()"
      [class.right-0]="transparent()"
      [class.left-0]="transparent()"
    >
      <!-- Hamburger — mobile/tablet -->
      @if (showMenuButton()) {
        <button
          (click)="menuClick.emit()"
          class="w-8 h-8 flex items-center justify-center rounded-lg
                 text-gray-500 dark:text-gray-400
                 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
        >
          <app-icon name="Menu" [size]="20" cssClass="stroke-gray-400" />
        </button>
      }

      <div class="flex-1"></div>

      <!-- Theme toggle -->
      <button
        (click)="themeService.toggle()"
        class="w-8 h-8 flex items-center justify-center rounded-lg
               text-gray-500 dark:text-gray-400
               hover:bg-gray-100 dark:hover:bg-gray-800
               transition-colors"
        [title]="themeService.isDark() ? 'Світла тема' : 'Темна тема'"
      >
        @if (themeService.isDark()) {
          <span class="material-icons text-xl shrink-0">light_mode</span>
        } @else {
          <span class="material-icons text-xl shrink-0">dark_mode</span>
        }
      </button>

      <!-- User email -->
      @if (user()) {
        <span class="text-sm text-gray-500 dark:text-gray-400">
          {{ user()!.email }}
        </span>
      }
    </header>
  `,
  imports: [IconComponent],
})
export class TopbarComponent {
  user = input<AuthUser | null>(null);
  transparent = input<boolean>(false);
  showMenuButton = input<boolean>(false);
  menuClick = output<void>();

  readonly themeService = inject(ThemeService);
}
