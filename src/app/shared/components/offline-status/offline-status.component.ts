import {ChangeDetectionStrategy, Component} from '@angular/core';

@Component({
  selector: 'app-offline-status',
  standalone: true,
  templateUrl: './offline-status.component.html',
  styleUrls: ['./offline-status.component.scss'],
  providers: [Component],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class OfflineStatusComponent {

}
