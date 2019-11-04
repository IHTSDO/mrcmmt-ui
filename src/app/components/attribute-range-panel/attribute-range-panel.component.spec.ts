import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AttributeRangePanelComponent } from './attribute-range-panel.component';

describe('AttributeRangePanelComponent', () => {
  let component: AttributeRangePanelComponent;
  let fixture: ComponentFixture<AttributeRangePanelComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AttributeRangePanelComponent ]
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
