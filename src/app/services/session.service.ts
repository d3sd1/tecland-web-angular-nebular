import {WebsocketClient} from '../websockets/websocket-client.service';
import {Injectable} from '@angular/core';
import {Message} from '@stomp/stompjs';
import {NbGlobalPhysicalPosition, NbToastrService} from '@nebular/theme';
import {NbToastStatus} from '@nebular/theme/components/toastr/model';
import {JwtHelperService} from '@auth0/angular-jwt';
import {JwtSession} from '../model/JwtSession';
import {NavigationStart, Router} from '@angular/router';
import {Channel} from '../websockets/Channel';
import {Subscription} from 'rxjs';
import {WebsocketRoute} from '../websockets/WebsocketRoute';
import {AppCommonRoutes} from '../app-common-routes';

/**
 * Abstraction layer for auth. Nice to have when things get more complicated.
 */
@Injectable()
export class SessionService {

  private userSessionChannel: Channel;
  private userSessionSubscription: Subscription;
  private userSessionPreferencesChannel: Channel;
  private userSessionPreferencesSubscription: Subscription;
  private userSessionTrackPagesSubscription: Subscription;
  private loggedInUserId: number;

  constructor(private ws: WebsocketClient, private toastrService: NbToastrService, private router: Router) {
    this.userSessionChannel = null;
    this.loggedInUserId = 0;
  }

  public login(jwt: string) {
    this.setSessionJwt(jwt);
    this.router.navigate([AppCommonRoutes.dashDefaultInitPage]);
  }

  public initSessionHandler() {
    this.loggedInUserId = this.decodeSessionJwt().data.jti;
    this.initUserSessionChannel();
    this.initUserPreferencesChannel();
    this.trackVisitedPages();
  }

  public endSessionHandler() {
    if (null !== this.userSessionChannel) {
      this.userSessionChannel.disconnect();
      this.userSessionSubscription.unsubscribe();
      this.userSessionTrackPagesSubscription.unsubscribe();
      this.userSessionChannel = null;
      this.userSessionSubscription = null;
      this.userSessionPreferencesChannel = null;
      this.userSessionPreferencesSubscription = null;
    }
  }

  public sessionExpireRemainMs() {
    return this.decodeSessionJwt().expirationDate.getTime() - (new Date()).getTime();
  }

  public trackVisitedPages() {
    this.userSessionTrackPagesSubscription = this.router.events.subscribe((event) => {
      if (event instanceof NavigationStart) {
        console.log("visited new page");
        //TODO: guyardar contra el rest
      }
    });
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
    this.userSessionChannel = this.ws.subscribe(WebsocketRoute.CHECK_SESSION, false);
    this.userSessionSubscription = this.userSessionChannel.stream().subscribe((message: Message) => {
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
    });
  }

  private initUserPreferencesChannel() {
    this.userSessionChannel = this.ws.subscribe(WebsocketRoute.SESSION_DATA, true);
    this.userSessionSubscription = this.userSessionChannel.stream().subscribe((message: Message) => {
      const logoutUserId = JSON.parse(message.body).data;
    });
    this.userSessionChannel.send({});
  }

}