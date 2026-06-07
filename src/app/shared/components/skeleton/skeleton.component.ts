import { Component, computed, input } from "@angular/core";

export type SkeletonVariant = "text" | "title" | "avatar" | "card" | "table-row" | "rect";

@Component({
  selector: 'app-skeleton',
  templateUrl: './skeleton.component.html',
  styleUrl: './skeleton.component.scss',
})
export class SkeletonComponent {
  variant = input<SkeletonVariant>('text');
  rows = input<number>(5);

  /**
   * @param width accept CSS value like 60% or 200px
   *  */
  width = input<string>('100%');

  height = input<string>('');
  rowsArray = computed(() => Array.from({ length: this.rows() }));
}