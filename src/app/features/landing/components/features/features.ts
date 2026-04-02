import { Component } from '@angular/core';
import {FEATURES_DATA} from '../../data/features.data';
import {TranslocoPipe} from '@jsverse/transloco';
import {AppIcon} from '../../../../shared/components/icon/icon';

@Component({
  selector: 'as-features',
  imports: [
    TranslocoPipe,
    AppIcon
  ],
  templateUrl: './features.html',
  styleUrl: './features.scss',
})
export class Features {
  protected readonly FEATURES_DATA = FEATURES_DATA;
}
