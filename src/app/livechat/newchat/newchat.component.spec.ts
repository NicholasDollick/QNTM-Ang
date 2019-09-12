/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

import { NewchatComponent } from './newchat.component';

describe('NewchatComponent', () => {
  let component: NewchatComponent;
  let fixture: ComponentFixture<NewchatComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ NewchatComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(NewchatComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
