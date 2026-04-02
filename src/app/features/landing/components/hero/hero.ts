import { Component } from '@angular/core';
import {AppButtonDirective} from '../../../../shared/directives/button/button.directive';
import {TranslocoPipe} from '@jsverse/transloco';
import {AppIcon} from '../../../../shared/components/icon/icon';

@Component({
  selector: 'as-hero',
  imports: [
    AppButtonDirective,
    TranslocoPipe,
    AppIcon
  ],
  templateUrl: './hero.html',
  styleUrl: './hero.scss',
})
export class Hero {}
