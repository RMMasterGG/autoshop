import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ServiceEditModalComponent } from './service-edit-modal';

describe('ShopEditModal', () => {
  let component: ServiceEditModalComponent;
  let fixture: ComponentFixture<ServiceEditModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ServiceEditModalComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(ServiceEditModalComponent);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
