import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { FormsModule } from '@angular/forms';
import { AlphabeticalPipe } from '../../pipes/alphabetical/alphabetical.pipe';

import { AttributeRangePanelComponent } from './attribute-range-panel.component';
import { BrowserDynamicTestingModule } from '@angular/platform-browser-dynamic/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { CustomOrderPipe } from '../../pipes/custom-order.pipe';
import { ModalComponent } from '../modal/modal.component';
import {ToastrModule} from 'ngx-toastr';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';

describe('AttributeRangePanelComponent', () => {
    let component: AttributeRangePanelComponent;
    let fixture: ComponentFixture<AttributeRangePanelComponent>;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            imports: [
                FormsModule,
                HttpClientTestingModule,
                BrowserDynamicTestingModule,
                RouterTestingModule,
                BrowserAnimationsModule,
                ToastrModule.forRoot()
            ],
            providers: [
                CustomOrderPipe
            ],
            declarations: [
                AttributeRangePanelComponent,
                AlphabeticalPipe,
                ModalComponent
            ]
        }).compileComponents();
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
