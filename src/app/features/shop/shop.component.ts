import {
  ChangeDetectionStrategy,
  Component,
  computed,
  DestroyRef,
  effect,
  inject,
  OnInit,
  signal,
} from '@angular/core';
import {AppIcon} from '../../shared/components/icon/icon';
import {TranslocoPipe} from '@jsverse/transloco';
import {ShopStore} from '../../shared/data-access/shop/shop.store';
import {FormGroup, NonNullableFormBuilder, ReactiveFormsModule} from '@angular/forms';
import {takeUntilDestroyed} from '@angular/core/rxjs-interop';
import {debounceTime, distinctUntilChanged} from 'rxjs';
import {DropDownComponent} from '../../shared/components/dropdown/drop-down.component';
import {SortOption} from '../../shared/data-access/shop/shop.model';
import {PriceRangeComponent} from './components/price-range/price-range.component';

@Component({
  selector: 'as-shop',
  standalone: true,
  templateUrl: './shop.component.html',
  styleUrls: ['./shop.component.scss'],
  providers: [],
  imports:[
    AppIcon,
    TranslocoPipe,
    ReactiveFormsModule,
    DropDownComponent,
    PriceRangeComponent
  ],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ShopComponent implements OnInit {
  readonly shopStore = inject(ShopStore);
  readonly fb = inject(NonNullableFormBuilder);
  private readonly destroyRef = inject(DestroyRef);

  readonly isFormReady = signal(false);

  readonly filterForm: FormGroup = this.fb.group({
    maxPrice: this.fb.control<number>(50000)
  });

  readonly sortOptions: { value: SortOption, label: string }[] =[
    { value: 'news', label: 'Новинки' },
    { value: 'less', label: 'Дешевле' },
    { value: 'grand', label: 'Дороже' }
  ];

  readonly orderedSortOptions = computed(() => {
    const currentSort = this.shopStore.sort();
    const options = [...this.sortOptions];

    const index = options.findIndex(opt => opt.value === currentSort);

    if (index > -1) {
      const [selected] = options.splice(index, 1);
      options.unshift(selected);
    }

    return options;
  });

  readonly sortLabels: Record<string, string> = {
    'news': 'Новинки',
    'less': 'Дешевле',
    'grand': 'Дороже'
  };

  constructor() {
    effect(() => {
      const categories = this.shopStore.categories();
      if (categories.length === 0) return;

      if (!this.filterForm.contains('all')) {
        // Добавляем контрол тихо, чтобы не вызывать valueChanges
        this.filterForm.addControl('all', this.fb.control(true), { emitEvent: false });
      }

      for (const category of categories) {
        if (!this.filterForm.contains(category.id)) {
          this.filterForm.addControl(category.id, this.fb.control(true), { emitEvent: false });
        }
      }
      this.isFormReady.set(true);
    });
  }

  ngOnInit() {
    this.shopStore.loadCards();

    this.filterForm.get('maxPrice')?.valueChanges
      .pipe(
        debounceTime(400),
        distinctUntilChanged(),
        takeUntilDestroyed(this.destroyRef)
      )
      .subscribe((newMaxPrice) => {
        console.log('Новая максимальная цена:', newMaxPrice);
        this.shopStore.setPriceFilter(newMaxPrice);
      });

    this.filterForm.valueChanges.pipe(
      debounceTime(400),
      distinctUntilChanged((prev, curr) => JSON.stringify(prev) === JSON.stringify(curr)),
      takeUntilDestroyed(this.destroyRef)
    ).subscribe(() => {
      if (this.isFormReady()) {
        this.sendFiltersToStore();
      }
    });
  }

  onSortChange(newSort: string) {
    this.shopStore.setSort(newSort as SortOption);
  }

  onCategoryChange(id: string | 'all') {
    const controls = this.filterForm.controls as any;
    if (id === 'all') {
      const isAllSelected = controls['all'].value;
      this.shopStore.categories().forEach(cat => {
        controls[cat.id].setValue(isAllSelected, { emitEvent: true });
      });
    } else {
      if (!controls[id].value && controls['all'].value) {
        controls['all'].setValue(false, { emitEvent: false });
      }
    }
  }

  private sendFiltersToStore() {
    const controls = this.filterForm.controls as {[key: string]: any };
    const allCategories = this.shopStore.categories();

    if (controls['all']?.value) {
      const allIds = allCategories.map(cat => cat.id);
      this.shopStore.setFilters(allIds);
      return;
    }

    const selectedIds = allCategories
      .filter(cat => controls[cat.id]?.value)
      .map(cat => cat.id);

    this.shopStore.setFilters(selectedIds);
  }
}
