import {ExtraOptions, RouterModule, Routes} from '@angular/router';
import {NgModule} from '@angular/core';
import {AuthGuard} from './guards/auth.guard';

const routes: Routes = [
  {
    path: 'pages', loadChildren: 'app/pages/pages.module#PagesModule',
    canActivate: [AuthGuard],
  },
  {path: '', redirectTo: 'auth/login', pathMatch: 'full'},

  {
    path: 'auth',
    loadChildren: './pages/auth/auth.module#NgxAuthModule',
  },
  {path: '**', redirectTo: 'auth/login'},
];

const config: ExtraOptions = {
  useHash: false,
};

@NgModule({
  imports: [RouterModule.forRoot(routes, config)],
  exports: [RouterModule],
})
export class AppRoutingModule {
}
