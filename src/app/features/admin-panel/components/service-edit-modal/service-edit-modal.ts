import {Component, inject, OnInit, signal} from '@angular/core';
import {FormBuilder, ReactiveFormsModule, Validators} from '@angular/forms';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material/dialog';
import {MatIconModule} from '@angular/material/icon';
import {UpperCasePipe, CommonModule} from '@angular/common';
import {TranslocoModule} from '@jsverse/transloco';
import {Category, AdminShop} from '../../../../shared/data-access/shop/shop.model';
import {ShopStore} from '../../../../shared/data-access/shop/shop.store';
import {ActionType, Service, ServiceAdmin} from '../../../../shared/data-access/services/service.model';
import {ServiceStore} from '../../../../shared/data-access/services/service.store';

@Component({
  selector: 'as-service-edit-modal',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, MatIconModule, UpperCasePipe, TranslocoModule],
  templateUrl: './service-edit-modal.html',
  styleUrl: './service-edit-modal.scss',
})
export class ServiceEditModalComponent implements OnInit {
  private readonly fb = inject(FormBuilder);
  private readonly serviceStore = inject(ServiceStore);
  private readonly dialogRef = inject(MatDialogRef<ServiceEditModalComponent>);
  public data = inject<{ id: string | null, categories: Category[] }>(MAT_DIALOG_DATA);

  readonly isEdit = signal(false);
  readonly isSaving = signal(false);
  readonly isLoadingData = signal(false);
  readonly activeLang = signal<string>('ru');
  readonly languageList = signal<string[]>(['ru', 'en']);
  readonly actionTypes = signal<ActionType[]>([]);

  readonly form = this.fb.group({
    id: [''],
    price: [0],
    icon: ['settings', Validators.required],
    showFlag: [true],
    actionType: ['', Validators.required],
    actionValue: [''],
    translations: this.fb.group({
      ru: this.fb.group({title: ['', Validators.required], description: ['', Validators.required]}),
      en: this.fb.group({title: ['', Validators.required], description: ['', Validators.required]})
    })
  });

  ngOnInit(): void {
    this.actionTypes.set([
      ActionType.MODAL,
      ActionType.LINK,
      ActionType.EXTERNAL,
      ActionType.REDIRECT]);
    if (this.data.id) {
      this.isEdit.set(true);
      this.loadProductData(this.data.id);
    }
  }

  private async loadProductData(id: string) {
    this.isLoadingData.set(true);
    try {
      const service = await this.serviceStore.getFullServiceById(id);
      this.patchForm(service);
    } catch (error) {
      console.error('Ошибка загрузки:', error);
    } finally {
      this.isLoadingData.set(false);
    }
  }

  private patchForm(service: ServiceAdmin) {

    this.form.patchValue({
      id: service.id,
      price: service.price,
      icon: service.icon,
      showFlag: service.showFlag,
      actionType: service.actionType,
      actionValue: service.actionValue,
    });

    service.translations.forEach(t => {
      const langGroup = this.form.get('translations')?.get(t.langCode.toLowerCase());
      if (langGroup) {
        langGroup.patchValue({
          title: t.title,
          description: t.description
        } as any); // Каст в any снимет строгую проверку свойств именно в этой строке
      }
    });
  }

  async save() {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    this.isSaving.set(true);

    const raw = this.form.getRawValue();
    const requestBody: ServiceAdmin = {
      ...raw,
      translations: Object.entries(raw.translations || {}).map(([code, val]: [string, any]) => ({
        langCode: code.toLowerCase(),
        title: val.title,
        description: val.description
      }))
    } as ServiceAdmin;

    try {
      let result: ServiceAdmin;

      if (this.isEdit() && raw.id) {
        result = await this.serviceStore.updateService(raw.id, requestBody);
      } else {

        result = await this.serviceStore.createService(requestBody);
      }

      this.dialogRef.close(result);
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
