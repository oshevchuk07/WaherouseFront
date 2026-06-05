import { Component, input } from '@angular/core';
import { NgIf } from '@angular/common';

@Component({
  selector: 'app-form-field',
  standalone: true,
  imports: [NgIf],
  template: `
    <div class="ui-field" [class.has-error]="!!error()">
      @if (label()) {
        <label class="ui-label">{{ label() }}</label>
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