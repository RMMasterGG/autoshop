import {Component, ChangeDetectionStrategy, inject, signal, computed} from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, Validators, FormGroup } from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';
import { TranslocoPipe, TranslocoService } from '@jsverse/transloco'; // Добавлен сервис
import { AppIcon } from '../../shared/components/icon/icon';
import { OrderStore } from '../../shared/data-access/orders/order.store';
import { PublicOrderRequest } from '../../shared/data-access/orders/order.model';
import {ServiceStore} from '../../shared/data-access/services/service.store';

@Component({
  selector: 'as-booking',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, MatIconModule, TranslocoPipe, AppIcon],
  templateUrl: './booking.component.html',
  styleUrl: './booking.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class BookingComponent {
  private fb = inject(FormBuilder);
  private readonly orderStore = inject(OrderStore);
  protected readonly serviceStore = inject(ServiceStore);

  readonly availableServices = computed(() =>
    this.serviceStore.entities().filter(s => s.actionType !== 'LINK')
  );

  isSubmitted = signal(false);
  isSubmitting = this.orderStore.isLoading;

  bookingForm: FormGroup = this.fb.group({
    name: ['', [Validators.required, Validators.minLength(2)]],
    email: ['', [Validators.required, Validators.email]],
    phone: ['', [Validators.required, Validators.pattern(/^(\+7|8)?[\s-]?\(?[489][0-9]{2}\)?[\s-]?[0-9]{3}[\s-]?[0-9]{2}[\s-]?[0-9]{2}$/)]],
    car: ['', Validators.required],
    serviceId: ['', Validators.required],
    message: ['']
  });

  async onSubmit() {
    if (this.bookingForm.invalid) {
      this.bookingForm.markAllAsTouched();
      return;
    }

    const formRaw = this.bookingForm.getRawValue();

    const request: PublicOrderRequest = {
      username: formRaw.name,
      email: formRaw.email,
      phone: formRaw.phone,
      car: formRaw.car,
      serviceId: formRaw.serviceId,
      message: formRaw.message
    };

    try {
      await this.orderStore.placeOrder(request);

      this.isSubmitted.set(true);
      this.bookingForm.reset();
    } catch (error) {
      console.error('Order failed', error);
    }
  }
}
