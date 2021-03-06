import {NgModule} from '@angular/core';

import {PagesComponent} from './pages.component';
import {PagesRoutingModule} from './pages-routing.module';
import {ThemeModule} from '../@theme/theme.module';
import {DashboardModule} from './dashboard/dashboard.module';
import {MiscellaneousModule} from './miscellaneous/miscellaneous.module';
import {ECommerceModule} from './e-commerce/e-commerce.module';
import {LogoutComponent} from './dashboard/logout/logout.component';

const PAGES_COMPONENTS = [
  PagesComponent,
  LogoutComponent
];

@NgModule({
  imports: [
    PagesRoutingModule,
    ThemeModule,
    DashboardModule,
    ECommerceModule,
    MiscellaneousModule,
  ],
  declarations: [
    ...PAGES_COMPONENTS,
  ],
})
export class PagesModule {
}
