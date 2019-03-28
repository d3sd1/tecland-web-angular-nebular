import {ExtraOptions, RouterModule, Routes} from '@angular/router';
import {NgModule} from '@angular/core';
import {SocketONGuard} from './guards/socketON.guard';
import {LoggedInGuard} from './guards/loggedIn.guard';
import {LoggedOutGuard} from './guards/loggedOut.guard';

const routes: Routes = [
  {
    path: 'dash', loadChildren: 'app/pages/pages.module#PagesModule',
    canActivate: [ LoggedInGuard, SocketONGuard],
  },

  {
    path: 'auth',
    loadChildren: './pages/auth/auth.module#NgxAuthModule',
    canActivate: [SocketONGuard, LoggedOutGuard],
  },
  {
    path: 'outpanel',
    loadChildren: './pages/error_outpanel/error.module#NgxErrorModule',
  },
  {path: '', redirectTo: 'auth/login', pathMatch: 'full'},
  {path: '**', redirectTo: 'auth/login'},
];

const config: ExtraOptions = {
  useHash: false,
};

@NgModule({
  imports: [RouterModule.forRoot(routes, config)],
  exports: [RouterModule]
})
export class AppRoutingModule {
}
