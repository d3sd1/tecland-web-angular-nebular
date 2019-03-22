import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { AuthService } from '../services/auth.service';
import {WebsocketClient} from '../websockets/websocket-client.service';


@Injectable()
export class SocketGuard implements CanActivate {
  constructor(private router: Router, private auth: AuthService, private ws: WebsocketClient) {}

  canActivate(next: ActivatedRouteSnapshot,
              state: RouterStateSnapshot): Observable<boolean> | Promise<boolean> | boolean {
    return new Observable<boolean>(observer => {
      setTimeout(() => {
        const online = this.ws.isConnected();
        if (online && !this.ws.wasConnected()) {
          // nnavegar a la pagina previa TODO
          this.ws.setPrevConnected(true);
          this.router.navigate(['/']);
        } else if (!online && this.router.url !== '/socket_server_down') {
          this.ws.setPrevConnected(false);
          this.router.navigate(['/socket_server_down']);
        }
        observer.next(online);
      }, 1000);
    });;
  }
}
