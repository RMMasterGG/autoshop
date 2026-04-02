import {Component, inject, OnInit} from '@angular/core';
import {TranslocoPipe} from '@jsverse/transloco';
import {AppIcon} from '../../../../shared/components/icon/icon';
import {MatDialog} from '@angular/material/dialog';
import {UserEditModalComponent} from '../user-edit-modal/user-edit-modal';
import {UserStore} from '../../../../shared/data-access/users/user.store';
import {FullUserResponse} from '../../../../shared/data-access/users/user.model';

@Component({
  selector: 'as-users',
  imports: [
    TranslocoPipe,
    AppIcon
  ],
  templateUrl: './users.html',
  styleUrl: './users.scss',
})
export class AdminUsersComponent implements OnInit {
  readonly dialog = inject(MatDialog);
  readonly userStore = inject(UserStore);

  ngOnInit() {
    this.userStore.loadAllUsers();
  }

  openProductModal(item: FullUserResponse | null = null) {
    const dialogRef = this.dialog.open(UserEditModalComponent, {
      width: '900px',
      maxWidth: '95vw',
      backdropClass: 'modal-backdrop-blur',
      panelClass: 'custom-modal-panel',
      data: {
        id: item?.id || null,
      }
    });
  }
}
