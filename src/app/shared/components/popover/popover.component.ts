import {
  Component,
  signal,
  ChangeDetectionStrategy, input, viewChild
} from '@angular/core';
import {
  CdkConnectedOverlay,
  CdkOverlayOrigin,
  ConnectedPosition,
  OverlayModule,
} from '@angular/cdk/overlay';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'ui-popover',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [OverlayModule, CommonModule],
  exportAs: 'uiPopover',
  templateUrl: './popover.component.html',
  styleUrl: './popover.component.scss',
})
export class PopoverComponent {

  readonly cdkOverlay = viewChild<CdkConnectedOverlay>(CdkConnectedOverlay);

  readonly isOpen = signal(false);

  readonly customClass = input<string>('')

  readonly externalTrigger = input<CdkOverlayOrigin | null>(null);

  readonly width = input<number | null>(null);

  readonly positions = input<ConnectedPosition[]>([
    {
      originX: 'center', originY: 'top',
      overlayX: 'center', overlayY: 'bottom',
      offsetY: -10
    },
    {
      originX: 'center', originY: 'bottom',
      overlayX: 'center', overlayY: 'top',
      offsetY: 10
    }
  ]);

  toggle() { this.isOpen.set(!this.isOpen()); }
  close() { this.isOpen.set(false); }

  public updatePosition() {
    if (this.cdkOverlay() && this.cdkOverlay()?.overlayRef) {
      this.cdkOverlay()?.overlayRef.updatePosition();
    }
  }

  public updateSize() {
  }

}
