import {Injectable} from '@angular/core';
import {ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot} from '@angular/router';
import {Observable} from 'rxjs';
import {SessionService} from '../services/session.service';
import {WebsocketClient} from '../websockets/websocket-client.service';
import {AppCommonRoutes} from '../app-common-routes';


@Injectable()
export class SocketOFFGuard implements CanActivate {
  constructor(private router: Router, private auth: SessionService, private ws: WebsocketClient) {
  }

  canActivate(next: ActivatedRouteSnapshot,
              state: RouterStateSnapshot): Observable<boolean> | Promise<boolean> | boolean {
    let poolChecker = null;
    return new Observable<boolean>(observer => {
      poolChecker = setInterval(() => {
        const online = this.ws.isSocketOnline();
        if (online) {
          clearInterval(poolChecker);
          const redirUrl = localStorage.getItem('sockets_down_redir');
          if (redirUrl === '' || redirUrl === null) {
            this.router.navigate([AppCommonRoutes.login]);
          } else {
            this.router.navigate([redirUrl]);
          }
          localStorage.setItem('sockets_down_redir', '');
        } else {
          /* Init session handler for disconnecting everyone that goes session when other is connected on same user */
          this.auth.endSessionHandler();
        }
        observer.next(!online);
      }, 1000);
    });
  }
}
