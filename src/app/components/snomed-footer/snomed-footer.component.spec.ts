import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { CustomOrderPipe } from '../../pipes/custom-order.pipe';

import { SnomedFooterComponent } from './snomed-footer.component';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { RouterTestingModule } from '@angular/router/testing';
import {ToastrModule} from 'ngx-toastr';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';

describe('SnomedFooterComponent', () => {
  let component: SnomedFooterComponent;
  let fixture: ComponentFixture<SnomedFooterComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
        imports: [
            HttpClientTestingModule,
            RouterTestingModule,
            BrowserAnimationsModule,
            ToastrModule.forRoot()
        ],
        declarations: [ SnomedFooterComponent ],
        providers: [ CustomOrderPipe ]
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
