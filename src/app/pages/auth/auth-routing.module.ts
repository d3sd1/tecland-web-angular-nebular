import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {NbAuthComponent} from '@nebular/auth';
import {NgxLoginComponent} from './login.component';

export const routes: Routes = [
  {
    path: '',
    component: NbAuthComponent,
    children: [
      { path: '', redirectTo: 'login', pathMatch: 'full' },
      {
        path: 'login',
        component: NgxLoginComponent,
      },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class NgxAuthRoutingModule {
}
