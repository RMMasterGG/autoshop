import {ChangeDetectionStrategy, Component, inject, OnInit} from '@angular/core';
import {NavigationEnd, Router, RouterOutlet} from '@angular/router';
import {NetworkState, NetworkStore} from './core/storage/network.store';
import {OfflineStatusComponent} from './shared/components/offline-status/offline-status.component';
import {filter} from 'rxjs';
import {HttpClient} from '@angular/common/http';
import {environment} from '../environments/environment';

@Component({
  selector: 'app-root',
  standalone: true,
  templateUrl: 'app.html',
  styleUrls: ['app.scss'],
  providers: [],
  imports: [
    RouterOutlet,
    OfflineStatusComponent
  ],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class AppComponent implements OnInit {
  readonly store = inject(NetworkStore);
  readonly router = inject(Router);
  readonly http = inject(HttpClient);

  ngOnInit() {
    this.router.events.pipe(

      filter(event => event instanceof NavigationEnd)
    ).subscribe((event: NavigationEnd) => {

      this.sendAnalyticsHit(event.urlAfterRedirects);
    });
  }

  private sendAnalyticsHit(path: string) {
    const analyticsUrl = `${environment.backendUrl}/api/analytics/hit`;

    this.http.post(analyticsUrl, { routerPath: path })
      .subscribe({
        error: (err) => console.error('Analytics error:', err)
      });
  }
}
