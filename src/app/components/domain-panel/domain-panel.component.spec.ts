import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { FormsModule } from '@angular/forms';
import { TopLevelDomainPipe } from '../../pipes/top-level-domain.pipe';
import { TextMatchPipe } from '../../pipes/text-match.pipe';
import { AlphabeticalPipe } from '../../pipes/alphabetical/alphabetical.pipe';
import { CustomOrderPipe } from '../../pipes/custom-order.pipe';

import { DomainPanelComponent } from './domain-panel.component';
import { BrowserDynamicTestingModule } from '@angular/platform-browser-dynamic/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { NgbTypeaheadModule } from '@ng-bootstrap/ng-bootstrap';
import { ModalComponent } from '../../components/modal/modal.component';
import {ToastrModule} from 'ngx-toastr';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';

describe('DomainPanelComponent', () => {
    let component: DomainPanelComponent;
    let fixture: ComponentFixture<DomainPanelComponent>;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            imports: [
                FormsModule,
                BrowserDynamicTestingModule,
                RouterTestingModule,
                HttpClientTestingModule,
                NgbTypeaheadModule,
                BrowserAnimationsModule,
                ToastrModule.forRoot()
            ],
            providers: [
                CustomOrderPipe
            ],
            declarations: [
                DomainPanelComponent,
                TopLevelDomainPipe,
                TextMatchPipe,
                AlphabeticalPipe,
                ModalComponent
            ]
        }).compileComponents();
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
