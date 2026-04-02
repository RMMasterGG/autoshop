import {ChangeDetectionStrategy, Component, effect, ElementRef, inject, input} from '@angular/core';
import {APP_ICONS, IconName} from './storage/icons.data';

@Component({
  selector: 'app-icon',
  standalone: true,
  template: ``,
  styleUrl: './icon.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class AppIcon {
  private el = inject(ElementRef);

  name = input.required<IconName>();

  constructor() {
    const effectRef = effect(() => {
      const svg = APP_ICONS[this.name()];
      this.el.nativeElement.innerHTML = svg;
    });
  }
}
