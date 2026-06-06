import { Component } from "@angular/core";
import { RouterOutlet } from "@angular/router";
import { NotificationsComponent } from "../../shared/components/notifications/notifications.component";

@Component({
  selector: 'app-landing-layout',
  imports: [
    RouterOutlet,
    NotificationsComponent
  ],
  templateUrl: './landing-layout.component.html'
})
export class LandingLayout { }