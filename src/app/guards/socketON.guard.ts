import {Injectable} from '@angular/core';
import {ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot} from '@angular/router';
import {Observable} from 'rxjs';
import {SessionService} from '../services/session.service';
import {WebsocketClient} from '../websockets/websocket-client.service';


@Injectable()
export class SocketONGuard implements CanActivate {
  constructor(private router: Router, private auth: SessionService, private ws: WebsocketClient) {
  }

  canActivate(next: ActivatedRouteSnapshot,
              state: RouterStateSnapshot): Observable<boolean> | Promise<boolean> | boolean {
    let poolChecker = null;
    return new Observable<boolean>(observer => {
      poolChecker = setInterval(() => {
        const online = this.ws.isSocketOnline();
        if (!online) {
          clearInterval(poolChecker);
          localStorage.setItem('sockets_down_redir', this.router.url);
          this.router.navigate(['/outpanel/server_down']);
        } else {
          /* Init session handler for disconnecting everyone that goes session when other is connected on same user */
          this.auth.initSessionHandler();
        }
        observer.next(online);
      }, 1000);
    });
  }
}
