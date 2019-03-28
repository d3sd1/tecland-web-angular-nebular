import {CommonModule} from '@angular/common';
import {NgModule} from '@angular/core';
import {FormsModule} from '@angular/forms';
import {RouterModule, Routes} from '@angular/router';

import {NbAuthComponent, NbAuthModule} from '@nebular/auth';
import {
  NbAlertModule,
  NbButtonModule,
  NbCheckboxModule,
  NbInputModule,
} from '@nebular/theme';
import {E404Component} from './E404/E404.component';
import {ErrorComponent} from './error.component';
import {ThemeModule} from '../../@theme/theme.module';
import {SocketOFFGuard} from '../../guards/socketOFF.guard';

export const routes: Routes = [
  {
    path: '',
    component: ErrorComponent,
    children: [
      { path: '', redirectTo: 'server_down', pathMatch: 'full' },
      {
        path: 'server_down',
        component: E404Component,
        canActivate: [SocketOFFGuard]
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
