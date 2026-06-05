import { Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { AuthStore } from '../../core/auth/auth.store';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [FormsModule],
  template: `
    <div class="w-full max-w-sm">

      <!-- Logo -->
      <div class="flex items-center gap-3 mb-8 justify-center">
        <span class="material-icons text-blue-400 text-3xl">inventory_2</span>
        <div class="leading-tight">
          <div class="font-bold text-white text-lg">WAREHOUSE</div>
          <div class="text-blue-400 text-xs font-normal tracking-widest">PLATFORM</div>
        </div>
      </div>

      <!-- Card -->
      <div class="bg-gray-900 rounded-2xl p-8 border border-gray-800">
        <h1 class="text-white text-xl font-semibold mb-6">Iniciar sesión</h1>

        <!-- Error -->
        @if (authStore.error()) {
          <div class="mb-4 px-4 py-3 rounded-lg bg-red-900/40 border border-red-700 text-red-400 text-sm">
            {{ authStore.error() }}
          </div>
        }

        <!-- Form -->
        <div class="flex flex-col gap-4">
          <div class="flex flex-col gap-1.5">
            <label class="text-gray-400 text-sm">Email</label>
            <input
              type="email"
              [(ngModel)]="email"
              placeholder="admin@warehouse.com"
              class="bg-gray-800 border border-gray-700 rounded-lg px-4 py-2.5 text-white
                     text-sm placeholder-gray-600 outline-none
                     focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-colors"
            />
          </div>

          <div class="flex flex-col gap-1.5">
            <label class="text-gray-400 text-sm">Contraseña</label>
            <input
              type="password"
              [(ngModel)]="password"
              placeholder="••••••••"
              (keydown.enter)="submit()"
              class="bg-gray-800 border border-gray-700 rounded-lg px-4 py-2.5 text-white
                     text-sm placeholder-gray-600 outline-none
                     focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-colors"
            />
          </div>

          <button
            (click)="submit()"
            [disabled]="authStore.loading()"
            class="mt-2 bg-blue-600 hover:bg-blue-500 disabled:bg-blue-900 disabled:cursor-not-allowed
                   text-white font-medium rounded-lg py-2.5 text-sm transition-colors"
          >
            @if (authStore.loading()) {
              <span class="flex items-center justify-center gap-2">
                <span class="material-icons text-base animate-spin">refresh</span>
                Cargando...
              </span>
            } @else {
              Entrar
            }
          </button>
        </div>
      </div>
    </div>
  `,
})
export class LoginComponent {
  readonly authStore = inject(AuthStore);

  email = '';
  password = '';

  submit(): void {
    if (!this.email || !this.password) return;
    this.authStore.login({ email: this.email, password: this.password });
  }
}