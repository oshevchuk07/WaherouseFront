import type { OnInit } from '@angular/core';
import { Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatTableModule } from '@angular/material/table';
import { MatSortModule } from '@angular/material/sort';
import { UsersStore } from './users.store';
import type { User } from '../../core/models/user.model';
import { MatDialog } from '@angular/material/dialog';
import { EditUserDialogComponent } from './edit-user/edit-user.dialog';
import { IconComponent } from '../../shared/components/icons/icons.component';

@Component({
  selector: 'app-users',
  imports: [FormsModule, MatTableModule, MatSortModule, IconComponent],
  providers: [UsersStore],
  templateUrl: './users.component.html',
})
export class UsersComponent implements OnInit {
  readonly store = inject(UsersStore);
  readonly dialog = inject(MatDialog);

  readonly columns = ['email', 'name', 'role', 'plan', 'paymentType', 'active', 'actions'];

  ngOnInit(): void {
    this.store.loadUsers();
  }

  fullName(user: User): string {
    return [user.firstName, user.lastName].filter(Boolean).join(' ') || '—';
  }

  edit(user: User): void {
    this.dialog
      .open(EditUserDialogComponent, {
        data: user,
      })
      .afterClosed()
      .subscribe(updated => {
        if (updated) this.store.loadUsers();
      });
  }
}
