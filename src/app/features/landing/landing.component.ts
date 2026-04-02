import {ChangeDetectionStrategy, Component} from '@angular/core';
import {Hero} from './components/hero/hero';
import {Features} from './components/features/features';
import {Services} from './components/services/services';
import {About} from './components/about/about';
import {Reviews} from './components/reviews/reviews';
import {Contacts} from './components/contacts/contacts';

@Component({
  selector: 'as-home',
  standalone: true,
  templateUrl: './landing.component.html',
  styleUrls: ['./landing.component.scss'],
  providers: [],
  imports: [
    Hero,
    Features,
    Services,
    About,
    Reviews,
    Contacts
  ],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class LandingComponent {

}
