import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CrudTaskComponent } from './crud-task.component';

describe('CrudTaskComponent', () => {
  let component: CrudTaskComponent;
  let fixture: ComponentFixture<CrudTaskComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CrudTaskComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CrudTaskComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
