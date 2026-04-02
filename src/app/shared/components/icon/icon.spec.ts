import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AppIcon } from './icon';

describe('Icon', () => {
  let component: AppIcon;
  let fixture: ComponentFixture<AppIcon>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AppIcon],
    }).compileComponents();

    fixture = TestBed.createComponent(AppIcon);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
