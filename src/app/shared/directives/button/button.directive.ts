import { computed, Directive, input, HostListener, inject, ElementRef } from '@angular/core';
import { ComponentSize } from '../../types/component-size.type';

type ButtonVariant = 'primary' | 'secondary' | 'ghost';

@Directive({
  selector: '[appButton]',
  standalone: true,
  host: {
    '[class]': 'buttonClasses()',
    '[attr.disabled]': 'isActuallyDisabled() ? true : null',
    '[attr.aria-disabled]': 'isActuallyDisabled()',
    '[attr.tabindex]': 'isActuallyDisabled() ? -1 : 0',
  }
})
export class AppButtonDirective {
  private el = inject(ElementRef);

  readonly variant = input<ButtonVariant>('primary');
  readonly size = input<ComponentSize>('md');
  readonly disabled = input(false);
  readonly isLoading = input<boolean>(false);

  protected readonly isActuallyDisabled = computed(() => this.disabled() || this.isLoading());

  protected readonly buttonClasses = computed(() => {
    return {
      'app-button': true,
      [`app-button--${this.variant()}`]: true,
      [`app-button--${this.size()}`]: true,
      'app-button--loading': this.isLoading(),
      'app-button--disabled': this.isActuallyDisabled()
    }
  });

  @HostListener('click', ['$event'])
  onClick(event: Event) {
    if (this.isActuallyDisabled()) {
      event.preventDefault();
      event.stopPropagation();
    }
  }
}
