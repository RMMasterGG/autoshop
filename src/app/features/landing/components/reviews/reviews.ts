import {Component, effect, ElementRef, inject, signal, viewChild} from '@angular/core';
import {TranslocoPipe} from '@jsverse/transloco';
import {AppIcon} from '../../../../shared/components/icon/icon';
import {AppButtonDirective} from '../../../../shared/directives/button/button.directive';
import {FormControl, FormGroup, ReactiveFormsModule, Validators} from '@angular/forms';
import {toSignal} from '@angular/core/rxjs-interop';
import {ServiceStore} from '../../../../shared/data-access/services/service.store';
import {ReviewStore} from './state/review.store';

export interface Review {
  id: number;
  author: string;
  rating: number;
  text: string;
  date: string;
}

@Component({
  selector: 'as-reviews',
  imports: [
    TranslocoPipe,
    AppIcon,
    AppButtonDirective,
    ReactiveFormsModule
  ],
  templateUrl: './reviews.html',
  styleUrl: './reviews.scss',
})
export class Reviews {

  readonly reviewStore = inject(ReviewStore);

  reviewForm = new FormGroup({
    author: new FormControl('', [Validators.required, Validators.minLength(3)]),
    rating: new FormControl(0, {
      nonNullable: true,
      validators: [Validators.min(1), Validators.max(5)]
    }),
    text: new FormControl('', [Validators.required, Validators.maxLength(500)]),
  });

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
        const {offsetLeft, offsetWidth} = item.nativeElement;

        if (offsetWidth === 0) return;

        const width = offsetWidth * 0.5;

        this.borderStyle.set({
          width: `${width}px`,
          opacity: 1
        });

      }, 50);
    });
  }

  readonly reviews = signal<Review[]>([
    {
      id: 0,
      author: "Александр Волков",
      rating: 5,
      text: "Лучший сервис в Тихорецке. Пригнал машину на диагностику ходовой — всё четко, без лишних накруток. Запчасти нашли за час.",
      date: "10.03.2026"
    },
    {
      id: 1,
      author: "Дмитрий П.",
      rating: 5,
      text: "Делал замену масла и фильтров. Понравилось, что пустили в ремзону. Мастера знают свое дело, всё аккуратно и быстро.",
      date: "09.01.2026"
    },
    {
      id: 2,
      author: "Иван Ерёмин",
      rating: 4,
      text: "Хороший сервис, удобная запись через сайт. Чуть задержали по времени, но качество ремонта перекрывает этот минус. Рекомендую.",
      date: "24.11.2025"
    },
    {
      id: 3,
      author: "Сергей Николаевич",
      rating: 5,
      text: "Ребята восстановили двигатель после перегрева. Работает как часы. Цены адекватные, не пытаются развести на ненужные услуги.",
      date: "17.11.2024"
    },
    {
      id: 4,
      author: "Михаил",
      rating: 5,
      text: "Очень крутой дизайн сервиса и современное оборудование. Сразу видно серьезный подход к делу. Теперь только к вам!",
      date: ""
    },
    {
      id: 5,
      author: "Андрей С.",
      rating: 4,
      text: "Нормальное СТО. Цены средние по городу, но отношение к клиенту на высоте. Всё объяснили, показали старые детали после замены.",
      date: "10.05.2025"
    },
  ]);

  protected setRating(index: number) {
    this.reviewForm.patchValue({rating: index});
  }

  readonly rating = toSignal(this.reviewForm.controls.rating.valueChanges, { initialValue: 0});
}
