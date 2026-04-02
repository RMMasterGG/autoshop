import {Component, inject, OnInit, signal} from '@angular/core';
import {ShopStore} from '../../../../shared/data-access/shop/shop.store';
import {TranslocoPipe} from '@jsverse/transloco';
import {AppIcon} from '../../../../shared/components/icon/icon';
import {ShopEditModalComponent} from '../shop-edit-modal/shop-edit-modal';
import {AdminShop, Shop, ShopEntity} from '../../../../shared/data-access/shop/shop.model';
import {MatDialog} from '@angular/material/dialog';

@Component({
  selector: 'as-shop',
  imports: [
    TranslocoPipe,
    AppIcon
  ],
  templateUrl: './shop.html',
  styleUrl: './shop.scss',
})
export class AdminShopComponent implements OnInit {
  ngOnInit(): void {
    this.shopStore.loadAdminCards();
  }

  readonly dialog = inject(MatDialog);
  readonly shopStore = inject(ShopStore);

  openProductModal(item: ShopEntity | null = null) {
    const dialogRef = this.dialog.open(ShopEditModalComponent, {
      width: '900px',
      maxWidth: '95vw',
      backdropClass: 'modal-backdrop-blur',
      panelClass: 'custom-modal-panel',
      data: {
        id: item?.id || null,
        categories: this.shopStore.categories()
      }
    });
  }
}
