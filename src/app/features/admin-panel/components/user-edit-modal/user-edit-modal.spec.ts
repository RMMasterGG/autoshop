import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ShopEditModal } from './user-edit-modal';

describe('ShopEditModal', () => {
  let component: ShopEditModal;
  let fixture: ComponentFixture<ShopEditModal>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ShopEditModal],
    }).compileComponents();

    fixture = TestBed.createComponent(ShopEditModal);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
