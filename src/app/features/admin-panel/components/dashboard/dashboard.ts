import {Component, computed, inject, OnInit} from '@angular/core';
import {TranslocoPipe} from '@jsverse/transloco';
import {AppIcon} from '../../../../shared/components/icon/icon';
import {DecimalPipe} from '@angular/common';
import {DashboardStore} from './data-access/dashboard.store';

@Component({
  selector: 'as-dashboard',
  imports: [
    TranslocoPipe,
    AppIcon,
    DecimalPipe
  ],
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.scss',
})
export class AdminDashboardComponent implements OnInit {
  readonly dashboardStore = inject(DashboardStore);

  ngOnInit() {
    this.dashboardStore.loadAllDashboardData();
  }

  readonly maxTraffic = computed(() => {
    const counts = this.dashboardStore.traffic().map(t => t.count);
    const max = Math.max(...counts);
    return max > 0 ? max : 1;
  });
}
