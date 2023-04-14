import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PayMenuComponent } from './pay-menu.component';

describe('PayMenuComponent', () => {
  let component: PayMenuComponent;
  let fixture: ComponentFixture<PayMenuComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PayMenuComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PayMenuComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
