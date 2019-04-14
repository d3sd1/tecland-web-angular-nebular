/**
 * @license
 * Copyright Akveo. All Rights Reserved.
 * Licensed under the MIT License. See License.txt in the project root for license information.
 */
import {APP_BASE_HREF} from '@angular/common';
import {BrowserModule} from '@angular/platform-browser';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {NgModule} from '@angular/core';
import {HttpClientModule} from '@angular/common/http';
import {CoreModule} from './@core/core.module';

import {AppComponent} from './app.component';
import {AppRoutingModule} from './app-routing.module';
import {ThemeModule} from './@theme/theme.module';
import {NgbModule} from '@ng-bootstrap/ng-bootstrap';
import {WebsocketClient} from './websockets/websocket-client.service';
import {SessionService} from './services/session.service';
import {LocationService} from './services/location.service';
import {SocketONGuard} from './guards/socketON.guard';
import {SocketOFFGuard} from './guards/socketOFF.guard';
import {LoggedInGuard} from './guards/loggedIn.guard';
import {LoggedOutGuard} from './guards/loggedOut.guard';
import {NbToastrModule} from '@nebular/theme';

@NgModule({
  declarations: [AppComponent],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    HttpClientModule,
    AppRoutingModule,

    NgbModule.forRoot(),
    ThemeModule.forRoot(),
    CoreModule.forRoot(),
    NbToastrModule.forRoot(),
  ],
  bootstrap: [AppComponent],
  providers: [
    WebsocketClient,
    SessionService,
    LocationService,
    LoggedInGuard,
    LoggedOutGuard,
    SocketONGuard,
    SocketOFFGuard,
    { provide: APP_BASE_HREF, useValue: '/' },
  ],
})
export class AppModule {
}
