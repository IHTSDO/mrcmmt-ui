import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ApplicableAttributesPanelComponent } from './applicable-attributes-panel.component';

describe('ApplicableAttributesPanelComponent', () => {
  let component: ApplicableAttributesPanelComponent;
  let fixture: ComponentFixture<ApplicableAttributesPanelComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ApplicableAttributesPanelComponent ]
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
