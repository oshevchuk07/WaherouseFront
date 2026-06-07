import { Component, input } from '@angular/core';

@Component({
  selector: 'app-form-field',
  standalone: true,
  template: `
    <div class="ui-field" [class.has-error]="!!error()">
      @if (label()) {
        <span class="ui-label">{{ label() }}</span>
      }
      <ng-content />
      @if (error()) {
        <span class="ui-error">{{ error() }}</span>
      }
      @if (!error() && hint()) {
        <span class="ui-hint-text">{{ hint() }}</span>
      }
    </div>
  `,
})
export class FormFieldComponent {
  label = input<string>('');
  error = input<string>('');
  hint = input<string>('');
}
