import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { RouterTestingModule } from '@angular/router/testing';
import { FormsModule } from '@angular/forms';
import { DuplicateFilterPipe } from '../../pipes/duplicate-filter.pipe';
import { DomainMatchPipe } from '../../pipes/domain-match.pipe';
import { TextMatchPipe } from '../../pipes/text-match.pipe';
import { AlphabeticalPipe } from '../../pipes/alphabetical.pipe';
import { ApplicableAttributesPanelComponent } from './applicable-attributes-panel.component';
import { InheritedDomainMatchPipe } from '../../pipes/inherited-domain-match.pipe';

describe('ApplicableAttributesPanelComponent', () => {
  let component: ApplicableAttributesPanelComponent;
  let fixture: ComponentFixture<ApplicableAttributesPanelComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [ FormsModule, HttpClientTestingModule, RouterTestingModule ],
      declarations: [
          ApplicableAttributesPanelComponent,
          DuplicateFilterPipe,
          DomainMatchPipe,
          InheritedDomainMatchPipe,
          TextMatchPipe,
          AlphabeticalPipe
      ]
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
