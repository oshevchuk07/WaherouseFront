import { Component } from "@angular/core";
import { RouterLink } from "@angular/router";

@Component({
  templateUrl: './landing.component.html',
  imports: [RouterLink]
})
export class LandingComponent {
  readonly year = new Date().getFullYear();

  readonly features = [
    {
      icon: 'view_in_ar',
      title: '3D Visualization',
      description: 'Explore your warehouse layout in real time with interactive 3D maps.',
    },
    {
      icon: 'psychology',
      title: 'AI Picking',
      description: 'Automated picking routes powered by machine learning models.',
    },
    {
      icon: 'tune',
      title: 'Plan Configurator',
      description: 'Build and manage pricing plans with flexible service groups.',
    },
  ];
}