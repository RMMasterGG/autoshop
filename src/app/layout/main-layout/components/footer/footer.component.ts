import {ChangeDetectionStrategy, Component} from '@angular/core';

@Component({
  selector: 'as-footer',
  standalone: true,
  templateUrl: './footer.component.html',
  styleUrls: ['./footer.component.scss'],
  providers: [],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class FooterComponent {

}
