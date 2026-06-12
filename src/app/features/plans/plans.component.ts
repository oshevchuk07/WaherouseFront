import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-plans',
  standalone: true,
  template: `
    <!-- <div class="flex flex-col gap-2">
      <h1 class="text-2xl font-semibold text-gray-800">Planes y precios</h1>
      <p class="text-gray-500 text-sm">Gestión de planes — en construcción</p>
    </div> -->
    <router-outlet />
  `,
  imports: [RouterOutlet],
})
export class PlansComponent {}
