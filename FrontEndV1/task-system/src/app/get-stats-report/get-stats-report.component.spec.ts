import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { GetStatsReportComponent } from './get-stats-report.component';

describe('GetStatsReportComponent', () => {
  let component: GetStatsReportComponent;
  let fixture: ComponentFixture<GetStatsReportComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ GetStatsReportComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(GetStatsReportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
