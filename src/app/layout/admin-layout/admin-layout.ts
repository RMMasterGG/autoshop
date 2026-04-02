import {Component, inject} from '@angular/core';
import {Aside} from './components/aside/aside';
import {RouterOutlet} from '@angular/router';
import {TranslocoPipe} from '@jsverse/transloco';
import {AuthStore} from '../../core/auth/auth.store';

@Component({
  selector: 'as-admin-layout',
  imports: [
    Aside,
    RouterOutlet
  ],
  templateUrl: './admin-layout.html',
  styleUrl: './admin-layout.scss',
})
export class AdminLayout {
  readonly authStore = inject(AuthStore);
}
