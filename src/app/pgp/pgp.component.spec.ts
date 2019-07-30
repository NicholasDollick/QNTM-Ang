/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

import { PgpComponent } from './pgp.component';

describe('PgpComponent', () => {
  let component: PgpComponent;
  let fixture: ComponentFixture<PgpComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PgpComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PgpComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
