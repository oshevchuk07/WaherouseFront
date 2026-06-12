import { Component, computed, inject, signal } from '@angular/core';
import { FormsModule, ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { MatTableModule } from '@angular/material/table';
import { FormFieldComponent } from '../../shared/components/form-field/form-field.component';
import { SkeletonComponent } from '../../shared/components/skeleton/skeleton.component';
import { NotificationService } from '../../core/notifications/notification.service';
import { DialogService } from '../../shared/services/dialog.service';
import { MatDialog } from '@angular/material/dialog';
import { TemplateEditDialogComponent } from './template-edit.dialog';

export interface TemplateItem {
  id: number;
  name: string;
  description: string;
  category: string;
  status: 'active' | 'pending' | 'inactive';
  isActive: boolean;
  createdAt: string;
}

const MOCK_ITEMS: TemplateItem[] = [
  {
    id: 1,
    name: 'Warehouse A',
    description: 'Main storage facility',
    category: 'Warehouse',
    status: 'active',
    isActive: true,
    createdAt: '2025-01-10',
  },
  {
    id: 2,
    name: 'Logistics Hub',
    description: 'Central dispatch point',
    category: 'Logistics',
    status: 'pending',
    isActive: true,
    createdAt: '2025-02-14',
  },
  {
    id: 3,
    name: 'Cold Storage',
    description: 'Temperature-controlled',
    category: 'Warehouse',
    status: 'active',
    isActive: true,
    createdAt: '2025-03-01',
  },
  {
    id: 4,
    name: 'Overflow Zone',
    description: 'Temporary overflow area',
    category: 'Other',
    status: 'inactive',
    isActive: false,
    createdAt: '2025-03-22',
  },
  {
    id: 5,
    name: 'Dispatch Bay 2',
    description: 'Secondary outbound bay',
    category: 'Logistics',
    status: 'active',
    isActive: true,
    createdAt: '2025-04-05',
  },
];

@Component({
  selector: 'app-template',
  templateUrl: './template.component.html',
  imports: [FormsModule, ReactiveFormsModule, MatTableModule, FormFieldComponent, SkeletonComponent],
})
export class TemplateComponent {
  readonly notify = inject(NotificationService);
  private readonly dialog = inject(MatDialog);
  private readonly dialogService = inject(DialogService);
  private readonly fb = inject(FormBuilder);

  // ── State ──────────────────────────────────────────────────────────────────

  readonly items = signal<TemplateItem[]>(MOCK_ITEMS);
  readonly loading = signal(false);

  // Filters as signals so computed() tracks them correctly
  readonly search = signal('');
  readonly statusFilter = signal('');
  readonly showActiveOnly = signal(false);

  readonly columns = ['name', 'category', 'status', 'isActive', 'date', 'actions'];

  // ── Computed ───────────────────────────────────────────────────────────────

  readonly filteredItems = computed(() => {
    const q = this.search().toLowerCase();
    return this.items().filter(item => {
      const matchSearch = !q || item.name.toLowerCase().includes(q) || item.description.toLowerCase().includes(q);
      const matchStatus = !this.statusFilter() || item.status === this.statusFilter();
      const matchActive = !this.showActiveOnly() || item.isActive;
      return matchSearch && matchStatus && matchActive;
    });
  });

  // ── Stats row ──────────────────────────────────────────────────────────────

  readonly stats = [
    { label: 'Total items', value: MOCK_ITEMS.length, icon: 'inventory_2', iconClass: 'text-blue-400' },
    { label: 'Active', value: MOCK_ITEMS.filter(i => i.status === 'active').length, icon: 'check_circle', iconClass: 'text-emerald-400' },
    { label: 'Pending', value: MOCK_ITEMS.filter(i => i.status === 'pending').length, icon: 'schedule', iconClass: 'text-amber-400' },
    { label: 'Inactive', value: MOCK_ITEMS.filter(i => i.status === 'inactive').length, icon: 'cancel', iconClass: 'text-red-400' },
  ];

  // ── Inline settings form ───────────────────────────────────────────────────

  readonly settingsForm = this.fb.nonNullable.group({
    name: ['', Validators.required],
    category: [''],
    notes: [''],
    isActive: [true],
    notifications: [false],
  });

  getError(field: string): string {
    const ctrl = this.settingsForm.get(field);
    if (!ctrl?.touched || !ctrl.errors) return '';
    if (ctrl.hasError('required')) return 'This field is required';
    return 'Invalid value';
  }

  saveSettings(): void {
    if (this.settingsForm.invalid) {
      this.settingsForm.markAllAsTouched();
      return;
    }
    this.notify.success('Settings saved');
  }

  resetSettings(): void {
    this.settingsForm.reset({ name: '', category: '', notes: '', isActive: true, notifications: false });
  }

  // ── Table actions ──────────────────────────────────────────────────────────

  edit(item: TemplateItem): void {
    this.dialog
      .open(TemplateEditDialogComponent, { data: item })
      .afterClosed()
      .subscribe(result => {
        if (result) this.notify.success(`"${result.name}" updated`);
      });
  }

  confirmDelete(item: TemplateItem): void {
    this.dialogService
      .confirm({
        title: 'Delete item',
        message: `"${item.name}" will be permanently removed. Continue?`,
        variant: 'danger',
        confirmLabel: 'Delete',
      })
      .subscribe(confirmed => {
        if (confirmed) this.notify.success(`"${item.name}" deleted`);
      });
  }

  openCreateDialog(): void {
    this.dialog
      .open(TemplateEditDialogComponent, { data: null })
      .afterClosed()
      .subscribe(result => {
        if (result) this.notify.success(`"${result.name}" created`);
      });
  }

  // ── Confirm dialog demos ───────────────────────────────────────────────────

  openConfirmDanger(): void {
    this.dialogService
      .confirm({
        title: 'Confirm action',
        message: 'This is a danger confirmation dialog example.',
        variant: 'danger',
        confirmLabel: 'Yes, delete',
      })
      .subscribe();
  }

  openConfirmInfo(): void {
    this.dialogService
      .confirm({
        title: 'Confirm action',
        message: 'This is an info confirmation dialog example.',
        variant: 'info',
        confirmLabel: 'Confirm',
      })
      .subscribe();
  }

  // ── Filter helpers ─────────────────────────────────────────────────────────

  clearFilters(): void {
    this.search.set('');
    this.statusFilter.set('');
    this.showActiveOnly.set(false);
  }
}
