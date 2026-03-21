import {Component, inject} from '@angular/core';
import {ReactiveFormsModule} from '@angular/forms';
import {AuthApiService} from '../../../../core/services/auth-api.service';

@Component({
  selector: 'app-login-form',
  standalone: true,
  imports: [ReactiveFormsModule],
  templateUrl: 'login-form.component.html',
  styleUrls: ['login-form.component.scss'],
})
export class LoginFormComponent {

  private authApi = inject(AuthApiService);

  submit() {
    // this.authApi.login(...).subscribe();
  }
}
