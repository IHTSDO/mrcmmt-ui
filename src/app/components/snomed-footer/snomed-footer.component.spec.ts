import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SnomedFooterComponent } from './snomed-footer.component';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';

describe('SnomedFooterComponent', () => {
  let component: SnomedFooterComponent;
  let fixture: ComponentFixture<SnomedFooterComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      declarations: [ SnomedFooterComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SnomedFooterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
