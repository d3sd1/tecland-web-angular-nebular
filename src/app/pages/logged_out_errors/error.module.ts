import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import {RouterModule, Routes} from '@angular/router';

import {NbAuthComponent, NbAuthModule} from '@nebular/auth';
import {
  NbAlertModule,
  NbButtonModule,
  NbCheckboxModule,
  NbInputModule,
} from '@nebular/theme';
import {NgxLoginComponent} from './login.component';
import {E404Component} from './E404/E404.component';
import {ErrorComponent} from './error.component';
import {ThemeModule} from '../../@theme/theme.module';

export const routes: Routes = [
  {
    path: '',
    component: ErrorComponent,
    children: [
      {
        path: 'server_down',
        component: E404Component,
      },
    ],
  },
];

@NgModule({
  imports: [
    ThemeModule,
    CommonModule,
    FormsModule,
    RouterModule,
    NbAlertModule,
    NbInputModule,
    NbButtonModule,
    NbCheckboxModule,

    NbAuthModule,
    RouterModule.forChild(routes)
  ],
  declarations: [
    E404Component,
    ErrorComponent
  ],
  exports: [RouterModule],
})
export class NgxErrorModule {
}
