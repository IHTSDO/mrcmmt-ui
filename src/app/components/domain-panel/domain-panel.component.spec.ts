import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DomainPanelComponent } from './domain-panel.component';

describe('DomainPanelComponent', () => {
  let component: DomainPanelComponent;
  let fixture: ComponentFixture<DomainPanelComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DomainPanelComponent ]
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
