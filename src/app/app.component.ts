import {ChangeDetectionStrategy, Component} from '@angular/core';
import {RouterOutlet} from '@angular/router';

@Component({
  selector: 'app-root',
  standalone: true,
  templateUrl: 'app.html',
  styleUrls: ['app.scss'],
  providers: [],
  imports: [
    RouterOutlet
  ],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class AppComponent {}
