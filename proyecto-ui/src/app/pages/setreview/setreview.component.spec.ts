import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SetreviewComponent } from './setreview.component';

describe('SetreviewComponent', () => {
  let component: SetreviewComponent;
  let fixture: ComponentFixture<SetreviewComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SetreviewComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SetreviewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
