import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RecoveryPageComponent } from './recovery-page.component';

describe('RecoveryPage', () => {
  let component: RecoveryPageComponent;
  let fixture: ComponentFixture<RecoveryPageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RecoveryPageComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RecoveryPageComponent);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
