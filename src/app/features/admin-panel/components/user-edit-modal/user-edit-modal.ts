import { Component, inject, OnInit, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { UpperCasePipe, CommonModule } from '@angular/common';
import { TranslocoModule } from '@jsverse/transloco';
import {UserStore} from '../../../../shared/data-access/users/user.store';
import {AdminUserRequest, FullUserResponse, UserRole} from '../../../../shared/data-access/users/user.model';

@Component({
  selector: 'as-user-edit-modal',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, MatIconModule, TranslocoModule],
  templateUrl: './user-edit-modal.html',
  styleUrl: './user-edit-modal.scss',
})
export class UserEditModalComponent implements OnInit {
  private readonly fb = inject(FormBuilder);
  private readonly userStore = inject(UserStore);
  private readonly dialogRef = inject(MatDialogRef<UserEditModalComponent>);

  // Принимаем ID пользователя
  public data = inject<{ id: string | null }>(MAT_DIALOG_DATA);

  readonly isEdit = signal(false);
  readonly isSaving = signal(false);
  readonly isLoadingData = signal(false);

  // Сохраняем твои переменные языков
  readonly activeLang = signal<string>('ru');
  readonly languageList = signal<string[]>(['ru', 'en']);

  // Роли для выпадающего списка
  readonly roles = signal<UserRole[]>([UserRole.USER, UserRole.ADMIN]);

  readonly form = this.fb.group({
    id: [''],
    username: ['', [Validators.required, Validators.minLength(3)]],
    email: ['', [Validators.required, Validators.email]],
    password: [''], // Для редактирования может быть пустым
    linkImg: [''],
    role: [UserRole.USER, Validators.required]
  });

  ngOnInit(): void {
    if (this.data.id) {
      this.isEdit.set(true);
      // Убираем валидатор обязательного пароля при редактировании
      this.form.get('password')?.clearValidators();
      this.loadUserData(this.data.id);
    } else {
      // При создании пароль обязателен
      this.form.get('password')?.setValidators([Validators.required, Validators.minLength(6)]);
    }
    this.form.get('password')?.updateValueAndValidity();
  }

  private async loadUserData(id: string) {
    this.isLoadingData.set(true);
    try {
      const user = await this.userStore.getUserInfo(id);
      this.patchForm(user);
    } catch (error) {
      console.error('Ошибка загрузки пользователя:', error);
    } finally {
      this.isLoadingData.set(false);
    }
  }

  private patchForm(user: FullUserResponse) {
    this.form.patchValue({
      id: user.id,
      username: user.username,
      email: user.email,
      linkImg: user.linkImg,
      role: user.role
    });
  }

  async save() {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    this.isSaving.set(true);
    const raw = this.form.getRawValue();

    const requestBody: AdminUserRequest = {
      username: raw.username!,
      email: raw.email!,
      password: raw.password || '',
      linkImg: raw.linkImg || '',
      role: raw.role as UserRole
    };

    try {
      if (this.isEdit() && raw.id) {
        await this.userStore.updateUser(raw.id, requestBody);
      } else {
        await this.userStore.createUser(requestBody);
      }
      this.dialogRef.close(true);
    } catch (error) {
      console.error('Ошибка при сохранении пользователя:', error);
    } finally {
      this.isSaving.set(false);
    }
  }

  close() {
    this.dialogRef.close();
  }
}
