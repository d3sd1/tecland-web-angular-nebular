import {ExtraOptions, RouterModule, Routes} from '@angular/router';
import {NgModule} from '@angular/core';
import {AuthGuard} from './guards/auth.guard';
import {SocketGuard} from './guards/socket.guard';

const routes: Routes = [
  {
    path: 'pages', loadChildren: 'app/pages/pages.module#PagesModule',
    canActivate: [AuthGuard, SocketGuard],
  },
  {path: '', redirectTo: 'auth/login', pathMatch: 'full'},

  {
    path: 'auth',
    loadChildren: './pages/auth/auth.module#NgxAuthModule',
    canActivate: [SocketGuard],
  },
  {
    path: 'outpanel',
    loadChildren: './pages/logged_out_errors/error.module#NgxErrorModule',
  },
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
