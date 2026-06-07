import { Component, inject } from "@angular/core";
import { RouterLoadingService } from "../../../core/services/loading.service";

@Component({
  selector: 'app-route-progress-bar',
  templateUrl: './route-progressbar.component.html',
  styleUrl: './route-progressbar.component.scss'
})
export class RouteProgressBarComponent {
  readonly loader = inject(RouterLoadingService);
}