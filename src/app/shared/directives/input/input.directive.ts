
import {computed, Directive, input} from '@angular/core';
import {ComponentSize} from '../../types/component-size.type';

@Directive({
  selector: 'input[appInput], textarea[appInput]',
  host: {
    '[class]': 'inputClasses()',
  }
})
export class AppInputDirective {

  readonly size = input<ComponentSize>('md');
  readonly hasError = input<boolean>(false);

  protected readonly inputClasses = computed(() => {
    return {
      'app-input': true,
      [`app-input--${this.size()}`]: true,
      'app-input--error': this.hasError()
    }
  });
}
