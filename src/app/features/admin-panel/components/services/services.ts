import {Component, inject, OnInit} from '@angular/core';
import {ServiceStore} from '../../../../shared/data-access/services/service.store';
import {TranslocoPipe} from '@jsverse/transloco';
import {AppIcon} from '../../../../shared/components/icon/icon';
import {Shop} from '../../../../shared/data-access/shop/shop.model';
import {ShopEditModalComponent} from '../shop-edit-modal/shop-edit-modal';
import {ServiceEditModalComponent} from '../service-edit-modal/service-edit-modal';
import {MatDialog} from '@angular/material/dialog';
import {Service} from '../../../../shared/data-access/services/service.model';

@Component({
  selector: 'as-services',
  imports: [
    TranslocoPipe,
    AppIcon
  ],
  templateUrl: './services.html',
  styleUrl: './services.scss',
})
export class AdminServicesComponent implements OnInit {
  readonly dialog = inject(MatDialog);
  readonly servicesStore = inject(ServiceStore);

  openProductModal(item: Service | null = null) {
    const dialogRef = this.dialog.open(ServiceEditModalComponent, {
      width: '900px',
      maxWidth: '95vw',
      backdropClass: 'modal-backdrop-blur',
      panelClass: 'custom-modal-panel',
      data: {
        id: item?.id || null,
      }
    });
  }

  ngOnInit(): void {
    this.servicesStore.loadAdminServices();
  }
}
