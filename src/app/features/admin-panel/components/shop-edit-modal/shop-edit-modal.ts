import { Component, inject, OnInit, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { UpperCasePipe, CommonModule } from '@angular/common';
import { TranslocoPipe } from '@jsverse/transloco';
import { Category, AdminShop } from '../../../../shared/data-access/shop/shop.model';
import { ShopStore } from '../../../../shared/data-access/shop/shop.store';

@Component({
  selector: 'as-shop-edit-modal',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, MatIconModule, UpperCasePipe, TranslocoPipe],
  templateUrl: './shop-edit-modal.html',
  styleUrl: './shop-edit-modal.scss',
})
export class ShopEditModalComponent implements OnInit {
  private readonly fb = inject(FormBuilder);
  private readonly shopStore = inject(ShopStore);
  private readonly dialogRef = inject(MatDialogRef<ShopEditModalComponent>);

  public data = inject<{ id: string | null, categories: Category[] }>(MAT_DIALOG_DATA);

  readonly isEdit = signal(false);
  readonly isSaving = signal(false);
  readonly isLoadingData = signal(false);
  readonly activeLang = signal<string>('ru');
  readonly languageList = signal<string[]>(['ru', 'en']);
  readonly categories = signal<Category[]>([]);

  readonly form = this.fb.group({
    id: [''],
    price: [0, [Validators.required, Validators.min(0)]],
    stock: [0, [Validators.required, Validators.min(0)]],
    category: ['', Validators.required],
    showFlag: [true],
    linkImg: [''],
    translations: this.fb.group({
      ru: this.fb.group({ title: ['', Validators.required], description: ['', Validators.required] }),
      en: this.fb.group({ title: ['', Validators.required], description: ['', Validators.required] })
    })
  });

  ngOnInit(): void {
    this.categories.set(this.data.categories || []);

    if (this.data.id) {
      this.isEdit.set(true);
      this.loadProductData(this.data.id);
    }
  }

  private async loadProductData(id: string) {
    this.isLoadingData.set(true);
    try {
      const product = await this.shopStore.getFullProductById(id);
      this.patchForm(product);
    } catch (error) {
      console.error('Ошибка загрузки продукта:', error);
    } finally {
      this.isLoadingData.set(false);
    }
  }

  private patchForm(product: AdminShop) {
    this.form.patchValue({
      id: product.id,
      price: product.price,
      stock: product.stock,
      category: product.category || (product as any).categoryId,
      showFlag: product.showFlag,
      linkImg: product.linkImg || ''
    });

    if (product.translations) {
      product.translations.forEach(t => {
        const lang = t.langCode.toLowerCase();
        const langGroup = this.form.get('translations')?.get(lang);
        if (langGroup) {
          langGroup.patchValue({
            title: t.title,
            description: t.description
          });
        }
      });
    }
  }

  async save() {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    this.isSaving.set(true);
    const raw = this.form.getRawValue();

    // Мапим данные из формы в структуру AdminShop DTO
    const requestBody: AdminShop = {
      id: raw.id || '',
      price: Number(raw.price),
      stock: Number(raw.stock),
      linkImg: raw.linkImg || '',
      showFlag: !!raw.showFlag,
      category: raw.category!,
      // @ts-ignore (на случай если бэк требует categoryId)
      categoryId: raw.category!,
      translations: Object.entries(raw.translations || {}).map(([code, val]: [string, any]) => ({
        langCode: code.toUpperCase(), // Серверу шлем "RU", "EN"
        title: val.title,
        description: val.description
      }))
    } as AdminShop;

    try {
      if (this.isEdit() && raw.id) {
        await this.shopStore.updateCard(raw.id, requestBody);
      } else {
        await this.shopStore.createCard(requestBody);
      }
      this.dialogRef.close(true);
    } catch (error) {
      console.error('Ошибка при сохранении:', error);
    } finally {
      this.isSaving.set(false);
    }
  }

  close() {
    this.dialogRef.close();
  }
}
