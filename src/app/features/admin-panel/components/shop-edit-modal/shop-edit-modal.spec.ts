import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ShopEditModalComponent } from './shop-edit-modal';

describe('ShopEditModal', () => {
  let component: ShopEditModalComponent;
  let fixture: ComponentFixture<ShopEditModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ShopEditModalComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(ShopEditModalComponent);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
