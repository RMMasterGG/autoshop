import { Component, inject } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { AppButtonDirective } from '../../../../shared/directives/button/button.directive';
import { TranslocoPipe } from '@jsverse/transloco';
import { AppIcon } from '../../../../shared/components/icon/icon';
import { AuthStore } from '../../../../core/auth/auth.store';

@Component({
  selector: 'app-register-form',
  standalone: true,
  imports: [ReactiveFormsModule, AppButtonDirective, TranslocoPipe, AppIcon],
  templateUrl: 'register-form.component.html',
  styleUrls: ['register-form.component.scss'],
})
export class RegisterFormComponent {
  protected readonly authStore = inject(AuthStore);

  protected registerForm = new FormGroup({
    name: new FormControl('', [Validators.required]),
    email: new FormControl('', [Validators.required, Validators.email]),
    password: new FormControl('', [Validators.required, Validators.minLength(6)]),
    confirmPassword: new FormControl('', [Validators.required]),
    terms: new FormControl(false, [Validators.requiredTrue]),
  });

  async onSubmit() {
    if (this.registerForm.invalid) {
      this.registerForm.markAllAsTouched();
      return;
    }

    const raw = this.registerForm.getRawValue();

    if (raw.password !== raw.confirmPassword) {
      alert('Пароли не совпадают');
      return;
    }

    const requestData = {
      username: raw.name,
      email: raw.email,
      password: raw.password
    };

    await this.authStore.register(requestData);
  }
}
