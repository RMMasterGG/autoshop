import {ChangeDetectionStrategy, Component} from '@angular/core';

@Component({
  selector: 'as-home',
  standalone: true,
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
  providers: [],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class HomeComponent {

}
