import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { DuplicateFilterPipe } from '../../pipes/duplicate-filter.pipe';
import { DomainMatchPipe } from '../../pipes/domain-match.pipe';
import { TextMatchPipe } from '../../pipes/text-match.pipe';
import { AlphabeticalPipe } from '../../pipes/alphabetical.pipe';


import { ApplicableAttributesPanelComponent } from './applicable-attributes-panel.component';

describe('ApplicableAttributesPanelComponent', () => {
  let component: ApplicableAttributesPanelComponent;
  let fixture: ComponentFixture<ApplicableAttributesPanelComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [ FormsModule, HttpClientTestingModule ],
      declarations: [ ApplicableAttributesPanelComponent, DuplicateFilterPipe, DomainMatchPipe, TextMatchPipe, AlphabeticalPipe ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ApplicableAttributesPanelComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
