import {ChangeDetectionStrategy, Component, inject, OnInit, signal} from '@angular/core';
import {ActivatedRoute, NavigationEnd, Router, RouterOutlet, Routes} from '@angular/router';
import {filter, map} from 'rxjs';
import {TranslocoPipe} from '@jsverse/transloco';
import {AppIcon} from '../../shared/components/icon/icon';
import {IconName} from '../../shared/components/icon/storage/icons.data';

@Component({
  selector: 'as-auth',
  standalone: true,
  templateUrl: './auth.component.html',
  styleUrls: ['./auth.component.scss'],
  providers: [],
  imports: [
    RouterOutlet,
    TranslocoPipe,
    AppIcon
  ],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class AuthComponent implements OnInit {
  readonly router = inject(Router);
  readonly route = inject(ActivatedRoute);

  title_part1 = signal("");
  title_part2 = signal("");
  subtitle = signal("");
  textLink = signal("");
  link = signal("");
  icon = signal<IconName>("");
  href = signal("");

  ngOnInit(): void {
    this.updateData();

    this.router.events.pipe(
      filter(event => event instanceof NavigationEnd)
    ).subscribe(() => {
      this.updateData();
    });
  }

  private updateData(): void {
    let childRoute = this.route.firstChild;
    while (childRoute?.firstChild) {
      childRoute = childRoute.firstChild;
    }

    const data = childRoute?.snapshot.data;

    this.title_part1.set(data?.['title_part1'] || 'Авторизация');
    this.title_part2.set(data?.['title_part2'] || '');
    this.subtitle.set(data?.['subtitle'] || '');
    this.textLink.set(data?.['text_link'] || '');
    this.link.set(data?.['link'] || '');
    this.icon.set(data?.['icon'] || '');
    this.href.set(data?.['href'] || '/');
  }
}
