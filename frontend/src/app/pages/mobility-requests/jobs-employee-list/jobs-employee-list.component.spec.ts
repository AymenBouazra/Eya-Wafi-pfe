import { ComponentFixture, TestBed } from '@angular/core/testing';

import { JobsEmployeeListComponent } from './jobs-employee-list.component';

describe('JobsEmployeeListComponent', () => {
  let component: JobsEmployeeListComponent;
  let fixture: ComponentFixture<JobsEmployeeListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ JobsEmployeeListComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(JobsEmployeeListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
