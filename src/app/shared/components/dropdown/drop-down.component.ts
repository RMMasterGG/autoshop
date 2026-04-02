import {Component, input, signal, viewChild} from '@angular/core';
import {PopoverComponent} from '../popover/popover.component';
import {ConnectedPosition} from '@angular/cdk/overlay';
import { NgTemplateOutlet } from '@angular/common';

@Component({
  selector: 'ui-dropdown',
  imports: [PopoverComponent, NgTemplateOutlet],
  exportAs: 'uiDropdown',
  templateUrl: './drop-down.component.html',
  styleUrl: './drop-down.component.scss',
})
export class DropDownComponent {
  readonly isOpen = signal(false);

  readonly customClass = input<string>('');

  readonly arrow = input(false);

  readonly pop = viewChild.required<PopoverComponent>('pop');

  readonly positions = input<ConnectedPosition[]>([
    {
      originX: 'center',
      originY: 'top',
      overlayX: 'center',
      overlayY: 'top',
      offsetY: 0,
    },
    {
      originX: 'center',
      originY: 'bottom',
      overlayX: 'center',
      overlayY: 'bottom',
      offsetY: 0,
    },
  ]);

  toggle() {
    this.isOpen.update((v) => !v);
  }

  hasOpen(): boolean {
    return this.pop().isOpen();
  }

  close() {
    this.pop().close();
  }
}
