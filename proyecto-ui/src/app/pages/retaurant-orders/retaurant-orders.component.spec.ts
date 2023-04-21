import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RetaurantOrdersComponent } from './retaurant-orders.component';

describe('RetaurantOrdersComponent', () => {
  let component: RetaurantOrdersComponent;
  let fixture: ComponentFixture<RetaurantOrdersComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ RetaurantOrdersComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RetaurantOrdersComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
