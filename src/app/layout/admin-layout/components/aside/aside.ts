import { Component } from '@angular/core';
import {RouterLink, RouterLinkActive} from '@angular/router';
import {TranslocoPipe} from '@jsverse/transloco';
import {AppIcon} from '../../../../shared/components/icon/icon';

@Component({
  selector: 'as-aside',
  imports: [
    RouterLink,
    RouterLinkActive,
    TranslocoPipe,
    AppIcon
  ],
  templateUrl: './aside.html',
  styleUrl: './aside.scss',
})
export class Aside {}
