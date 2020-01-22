import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { RouterTestingModule } from '@angular/router/testing';
import { FormsModule } from '@angular/forms';
import { AlphabeticalPipe } from '../../pipes/alphabetical.pipe';

import { AttributeRangePanelComponent } from './attribute-range-panel.component';

describe('AttributeRangePanelComponent', () => {
  let component: AttributeRangePanelComponent;
  let fixture: ComponentFixture<AttributeRangePanelComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [ FormsModule, HttpClientTestingModule, RouterTestingModule ],
      declarations: [ AttributeRangePanelComponent, AlphabeticalPipe ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AttributeRangePanelComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
