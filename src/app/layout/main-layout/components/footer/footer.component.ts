import {ChangeDetectionStrategy, Component} from '@angular/core';
import {TranslocoPipe} from '@jsverse/transloco';
import {navItems} from '../header/types/navigation.types';
import {AppButtonDirective} from '../../../../shared/directives/button/button.directive';
import {AppInputDirective} from '../../../../shared/directives/input/input.directive';
import {AppIcon} from '../../../../shared/components/icon/icon';

@Component({
  selector: 'as-footer',
  standalone: true,
  templateUrl: './footer.component.html',
  styleUrls: ['./footer.component.scss'],
  providers: [],
  imports: [
    TranslocoPipe,
    AppButtonDirective,
    AppInputDirective,
    AppIcon
  ],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class FooterComponent {

  readonly currentYear = new Date().getFullYear();
}
