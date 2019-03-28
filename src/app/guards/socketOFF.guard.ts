import {Injectable} from '@angular/core';
import {CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router} from '@angular/router';
import {Observable} from 'rxjs';
import {AuthService} from '../services/auth.service';
import {WebsocketClient} from '../websockets/websocket-client.service';


@Injectable()
export class SocketOFFGuard implements CanActivate {
  constructor(private router: Router, private auth: AuthService, private ws: WebsocketClient) {
  }

  canActivate(next: ActivatedRouteSnapshot,
              state: RouterStateSnapshot): Observable<boolean> | Promise<boolean> | boolean {
    let poolChecker = null;
    return new Observable<boolean>(observer => {
      poolChecker = setInterval(() => {
        const online = this.ws.isSocketOnline();
        if (online) {
          clearInterval(poolChecker);
          if (localStorage.getItem('sockets_down_redir') === '') {
            this.router.navigate(['/auth/login']);
          } else {
            this.router.navigate([localStorage.getItem('sockets_down_redir')]);
          }
          localStorage.setItem('sockets_down_redir', '');
        }
        observer.next(!online);
      }, 1000);
    });
  }
}
