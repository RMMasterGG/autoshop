import {
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  inject,
  NgZone,
  signal,
  viewChildren,
  AfterViewInit,
  OnDestroy,
  computed,
  HostListener
} from '@angular/core';
import { Router, NavigationEnd, RouterLink, RouterLinkActive } from '@angular/router';
import { TranslocoPipe } from '@jsverse/transloco';
import { NgStyle } from '@angular/common';
import { filter } from 'rxjs';
import { navItems } from './types/navigation.types';
import { AppButtonDirective } from '../../../../shared/directives/button/button.directive';
import { AppIcon } from '../../../../shared/components/icon/icon';
import {AuthStore} from '../../../../core/auth/auth.store';


@Component({
  selector: 'as-header',
  standalone: true,
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
  imports: [TranslocoPipe, NgStyle, AppButtonDirective, AppIcon, RouterLink, RouterLinkActive],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class HeaderComponent implements AfterViewInit, OnDestroy {
  readonly isMenuOpen = signal(false);
  readonly authStore = inject(AuthStore);

  toggleMenu() {
    this.isMenuOpen.update(v => !v);
  }

  closeMenu() {
    this.isMenuOpen.set(false);
  }

  readonly navButtons = viewChildren<ElementRef<HTMLElement>>('navButtons');

  private zone = inject(NgZone);
  private router = inject(Router);

  readonly activeIndex = signal(-1);
  readonly isInitialized = signal(false);
  protected readonly navItems = navItems;

  readonly indicatorStyles = computed(() => {
    const index = this.activeIndex();
    const buttons = this.navButtons();

    if (index === -1 || buttons.length === 0) {
      return { left: '0px', width: '0px', opacity: 0 };
    }

    const activeItem = buttons[index].nativeElement;
    const { offsetLeft, offsetWidth } = activeItem;

    const width = offsetWidth * 0.75;
    const left = offsetLeft + (offsetWidth - width) / 2;

    return {
      left: `${left}px`,
      width: `${width}px`,
      opacity: 1
    };
  });

  private isManualScrolling = false;
  private observer?: IntersectionObserver;

  private rebindObservers() {
    this.zone.runOutsideAngular(() => {
      this.observer?.disconnect();

      this.initScrollSpy();

      this.navItems.forEach(item => {
        const id = item.link;
        const element = document.getElementById(id);
        if (element) {
          this.observer?.observe(element);
        }
      });
    });
  }

  constructor() {
    this.router.events.pipe(
      filter(event => event instanceof NavigationEnd)
    ).subscribe((event: any) => {
      const isHome = event.urlAfterRedirects === '/' || event.urlAfterRedirects.includes('#');
      if (isHome) {
        setTimeout(() => {
          this.checkInitialFragment();
          this.rebindObservers();
        }, 100);
      } else {
        this.activeIndex.set(-1);
        this.observer?.disconnect();
      }
    });
  }

  ngAfterViewInit() {
    const isHome = this.router.url === '/' || this.router.url.includes('#');

    if (isHome) {
      this.zone.runOutsideAngular(() => {
        this.initScrollSpy();
        this.checkInitialFragment();
      });

      requestAnimationFrame(() => this.isInitialized.set(true));
    }
  }

  private checkInitialFragment() {
    const fragment = this.router.url.split('#')[1];

    if (fragment) {
      const index = this.navItems.findIndex(item => item.link.replace('#', '') === fragment);
      if (index !== -1) {
        this.zone.run(() => this.activeIndex.set(index));
      }
    } else {
      this.zone.run(() => this.activeIndex.set(0));
    }
  }

  private initScrollSpy() {
    this.observer = new IntersectionObserver((entries) => {
      if (this.isManualScrolling) return;

      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const id = entry.target.id;
          const index = this.navItems.findIndex(item => item.link.replace('#', '') === id);

          if (index !== -1 && index !== this.activeIndex()) {
            // Возвращаемся в зону Angular только для обновления сигнала
            this.zone.run(() => this.activeIndex.set(index));
          }
        }
      });
    }, {
      // Настройка области срабатывания (середина экрана)
      rootMargin: '-20% 0px -70% 0px',
      threshold: 0
    });

    this.navItems.forEach(item => {
      const element = document.getElementById(item.link.replace('#', ''));
      if (element) this.observer?.observe(element);
    });
  }

  // Обновляем позицию при ресайзе окна
  @HostListener('window:resize')
  onResize() {
    // Просто "пинаем" сигнал, чтобы computed пересчитался
    this.activeIndex.set(this.activeIndex());
  }

  setActive(event: Event, index: number, link: string) {
    if (!link.startsWith('#')) return;

    // Включаем режим ручного скролла, чтобы ScrollSpy не перебивал индекс
    this.isManualScrolling = true;
    this.activeIndex.set(index);

    // Скролл выполнит браузер благодаря withAnchorScrolling() в конфиге,
    // но мы блокируем ScrollSpy на секунду для плавности
    setTimeout(() => { this.isManualScrolling = false; }, 1000);
  }

  ngOnDestroy() {
    this.observer?.disconnect();
  }

  protected goToHome() {
    this.router.navigate(['/']);
  }
}
