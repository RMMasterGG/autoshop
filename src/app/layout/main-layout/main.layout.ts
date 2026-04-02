import {ChangeDetectionStrategy, Component, inject} from '@angular/core';
import {HeaderComponent} from './components/header/header.component';
import {RouterOutlet} from '@angular/router';
import {FooterComponent} from './components/footer/footer.component';
import {NetworkStore} from '../../core/storage/network.store';

@Component({
  selector: 'app-layout',
  standalone: true,
  templateUrl: 'main.layout.html',
  styleUrls: ['main.layout.scss'],
  providers: [],
  imports: [
    HeaderComponent,
    RouterOutlet,
    FooterComponent
  ],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class LayoutComponent {
}
