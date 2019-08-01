import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DisplayModifyComponent } from './display-modify.component';

describe('DisplayModifyComponent', () => {
  let component: DisplayModifyComponent;
  let fixture: ComponentFixture<DisplayModifyComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DisplayModifyComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DisplayModifyComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
