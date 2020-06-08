import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { StateUploadComponent } from './state-upload.component';

describe('StateUploadComponent', () => {
  let component: StateUploadComponent;
  let fixture: ComponentFixture<StateUploadComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ StateUploadComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(StateUploadComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
