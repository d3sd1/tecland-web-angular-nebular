import {WebsocketClient} from '../websockets/websocket-client.service';
import {Injectable} from '@angular/core';
import {Message} from '@stomp/stompjs';
import {NbGlobalPhysicalPosition, NbToastrService} from '@nebular/theme';
import {NbToastStatus} from '@nebular/theme/components/toastr/model';
import {JwtHelperService} from '@auth0/angular-jwt';
import {JwtSession} from '../model/JwtSession';
import {NavigationStart, Router} from '@angular/router';
import {Subscription} from 'rxjs';
import {WebsocketRoute} from '../websockets/WebsocketRoute';
import {AppCommonRoutes} from '../app-common-routes';

/**
 * Abstraction layer for auth. Nice to have when things get more complicated.
 */
@Injectable()
export class SessionService {

  private loggedInUserId; // TYPE USER
  private sessionActive: boolean;
  private subs: Subscription[];

  constructor(private ws: WebsocketClient, private toastrService: NbToastrService, private router: Router) {
    this.loggedInUserId = 0;
    this.sessionActive = false;
    this.subs = [];
  }

  public login(jwt: string) {
    this.setSessionJwt(jwt);
    this.router.navigate([AppCommonRoutes.dashDefaultInitPage]);
  }

  public initSessionHandler() {
    if (!this.sessionActive) {
      this.loggedInUserId = this.decodeSessionJwt().data.jti;
      this.initUserSessionChannel();
      this.initUserPreferencesChannel();
      this.trackVisitedPages();
      this.sessionActive = true;
    }
  }

  public endSessionHandler() {
    if (this.sessionActive) {
      this.subs.forEach((sub: Subscription) => {
        sub.unsubscribe();
      });
      this.subs = [];
      this.sessionActive = false;
    }
  }

  public sessionExpireRemainMs() {
    console.log(this.decodeSessionJwt().expirationDate.getTime() - (new Date()).getTime());
    return this.decodeSessionJwt().expirationDate.getTime() - (new Date()).getTime();
  }

  public trackVisitedPages() {
    this.subs.push(this.router.events.subscribe((event) => {
      if (event instanceof NavigationStart) {
        // console.log("visited new page");
        // TODO: guyardar contra el rest
      }
    }));
  }

  public logout(): Promise<boolean> {
    const logoutJwt = this.ws.subscribe(WebsocketRoute.LOGOUT, true);

    logoutJwt.send({
      'jwt': this.getSessionJwt(),
    });
    this.endSessionHandler();
    this.setSessionJwt('');
    return this.router.navigate([AppCommonRoutes.login]);
  }

  public getSessionJwt(): string {
    return localStorage.getItem('userSessionTL');
  }

  public setSessionJwt(jwt: string) {
    localStorage.setItem('userSessionTL', jwt);
  }

  public decodeSessionJwt(): JwtSession {
    const jwtSession = new JwtSession();
    try {
      const helper = new JwtHelperService();
      const jwt = this.getSessionJwt();

      jwtSession.data = helper.decodeToken(jwt);
      jwtSession.expired = helper.isTokenExpired(jwt);
      jwtSession.expirationDate = helper.getTokenExpirationDate(jwt);
    } catch (e) {
      jwtSession.data = null;
      jwtSession.expired = true;
      jwtSession.expirationDate = new Date();
    }

    return jwtSession;
  }

  public isSessionExpired(): boolean {
    return this.decodeSessionJwt().expired;
  }

  private initUserSessionChannel() {
    const userSess = this.ws.subscribe(WebsocketRoute.CHECK_SESSION, false);
    this.subs.push(userSess.stream((message: Message) => {
      const logoutUserId = JSON.parse(message.body).data;
      if (parseInt(logoutUserId, 10) === parseInt(this.loggedInUserId.toString(), 10)) {
        this.logout().then(() => {
          this.toastrService.show(
            'Conectado desde otro equipo. ',
            `Desconexión por seguridad.`,
            {
              position: NbGlobalPhysicalPosition.BOTTOM_RIGHT,
              status: NbToastStatus.WARNING,
              duration: 10000,
              preventDuplicates: true,
              destroyByClick: false,
            });
        });
      }
    }));
  }

  private initUserPreferencesChannel() {
    const sessChannel = this.ws.subscribe(WebsocketRoute.SESSION_DATA, true);
    this.subs.push(sessChannel.stream((message: Message) => {
      const logoutUserId = JSON.parse(message.body).data;
    }));
    /* send alive packet so we receive data */
    sessChannel.send({});
  }

}
