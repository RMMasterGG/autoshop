import {ChangeDetectionStrategy, Component, computed, forwardRef, input, signal} from '@angular/core';
import {NG_VALUE_ACCESSOR} from '@angular/forms';
import {DecimalPipe} from '@angular/common';

@Component({
  selector: 'as-price-range',
  standalone: true,
  templateUrl: './price-range.component.html',
  styleUrls: ['./price-range.component.scss'],
  providers:[
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => PriceRangeComponent),
      multi: true
    }
  ],
  imports: [DecimalPipe],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class PriceRangeComponent {

  readonly min = input<number>(0);
  readonly max = input<number>(50000);
  readonly step = input<number>(100);

  readonly currentValue = signal<number>(0);

  readonly progress = computed(() => {
    const min = this.min();
    const max = this.max();
    const val = this.currentValue();
    return ((val - min) / (max - min)) * 100;
  });

  private onChange = (value: number) => {};
  private onTouched = () => {};

  onInput(event: Event) {
    const inputEl = event.target as HTMLInputElement;
    const val = Number(inputEl.value);

    this.currentValue.set(val);
    this.onChange(val);
  }

  onBlur() {
    this.onTouched();
  }

  writeValue(value: number): void {
    if (value !== undefined && value !== null) {
      this.currentValue.set(value);
    } else {
      this.currentValue.set(this.min());
    }
  }

  registerOnChange(fn: any): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: any): void {
    this.onTouched = fn;
  }
}
