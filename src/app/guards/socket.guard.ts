import {Injectable} from '@angular/core';
import {CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router} from '@angular/router';
import {Observable} from 'rxjs';
import {AuthService} from '../services/auth.service';
import {WebsocketClient} from '../websockets/websocket-client.service';


@Injectable()
export class SocketGuard implements CanActivate {
  constructor(private router: Router, private auth: AuthService, private ws: WebsocketClient) {
  }

  canActivate(next: ActivatedRouteSnapshot,
              state: RouterStateSnapshot): Observable<boolean> | Promise<boolean> | boolean {
    let poolChecker = null;
    return new Observable<boolean>(observer => {
      poolChecker = setInterval(() => {
        const online = this.ws.isSocketOnline();
        if (!online) {
          clearInterval(poolChecker);
          this.router.navigate(['/outpanel/server_down']);
        }
        observer.next(online);
      }, 1000);
    });
    ;
  }
}
