import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DomainPanelComponent } from './components/domain-panel/domain-panel.component';
import { ApplicableAttributesPanelComponent } from './components/applicable-attributes-panel/applicable-attributes-panel.component';
import { AttributeRangePanelComponent } from './components/attribute-range-panel/attribute-range-panel.component';

const routes: Routes = [
    {
        path: ':id',
        component: DomainPanelComponent,
        children: [
            {
                path: ':id',
                component: ApplicableAttributesPanelComponent,
                children: [
                    {
                        path: ':id',
                        component: AttributeRangePanelComponent
                    }
                ]
            }
        ]
    }
];

@NgModule({
    imports: [RouterModule.forRoot(routes)],
    exports: [RouterModule]
})
export class AppRoutingModule { }
