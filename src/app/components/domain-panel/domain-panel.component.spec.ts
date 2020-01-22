import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { TopLevelDomainPipe } from '../../pipes/top-level-domain.pipe';
import { TextMatchPipe } from '../../pipes/text-match.pipe';
import { AlphabeticalPipe } from '../../pipes/alphabetical.pipe';

import { DomainPanelComponent } from './domain-panel.component';

describe('DomainPanelComponent', () => {
  let component: DomainPanelComponent;
  let fixture: ComponentFixture<DomainPanelComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [ FormsModule ],
      declarations: [ DomainPanelComponent, TopLevelDomainPipe, TextMatchPipe, AlphabeticalPipe ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DomainPanelComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
