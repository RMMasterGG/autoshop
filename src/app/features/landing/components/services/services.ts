import {Component, effect, ElementRef, inject, OnInit, signal, viewChild} from '@angular/core';
import {TranslocoPipe} from '@jsverse/transloco';
import {ServiceStore} from '../../../../shared/data-access/services/service.store';
import {DecimalPipe} from '@angular/common';
import {AppIcon} from '../../../../shared/components/icon/icon';
import {ActionType, serviceUtils} from '../../../../shared/data-access/services/service.model';
import {Router} from '@angular/router';
import {routes} from '../../../../app.routes';

@Component({
  selector: 'as-services',
  imports: [
    TranslocoPipe,
    DecimalPipe,
    AppIcon
  ],
  templateUrl: './services.html',
  styleUrl: './services.scss',
})
export class Services implements OnInit {

  readonly router = inject(Router);

  readonly servicesStore = inject(ServiceStore);

  readonly title = viewChild<ElementRef>('title');

  readonly borderStyle = signal<{ width: string, opacity: number }>({
    width: '0px',
    opacity: 0
  });

  constructor() {
    effect(() => {
      const item = this.title();
      if (!item) return;

      setTimeout(() => {
        const {offsetWidth} = item.nativeElement;

        if (offsetWidth === 0) return;

        const width = offsetWidth * 0.5;

        this.borderStyle.set({
          width: `${width}px`,
          opacity: 1
        });

      }, 50);
    });
  }

  ngOnInit(): void {
    this.servicesStore.loadAllServices();
  }

  protected onServiceSelect(actionType: string, actionValue: string) {
    if (serviceUtils.isLink(actionType)) {
      this.router.navigate([actionValue]);
    }
  }
}
