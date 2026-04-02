import {Component, inject} from '@angular/core';
import {FormControl, FormGroup, ReactiveFormsModule, Validators} from '@angular/forms';
import {AppButtonDirective} from '../../../../shared/directives/button/button.directive';
import {TranslocoPipe} from '@jsverse/transloco';
import {AppIcon} from '../../../../shared/components/icon/icon';
import {AuthStore} from '../../../../core/auth/auth.store';

@Component({
  selector: 'app-login-form',
  standalone: true,
  imports: [ReactiveFormsModule, AppButtonDirective, TranslocoPipe, AppIcon],
  templateUrl: 'login-form.component.html',
  styleUrls: ['login-form.component.scss'],
})
export class LoginFormComponent {

  protected readonly authStore = inject(AuthStore);

  protected loginForm = new FormGroup({
    email: new FormControl('', [Validators.required, Validators.email]),
    password: new FormControl('', [Validators.required, Validators.minLength(6)])
  });

  async onSubmit() {
    if (this.loginForm.invalid) {
      this.loginForm.markAllAsTouched();
      return;
    }

    await this.authStore.login(this.loginForm.getRawValue());
  }
}
