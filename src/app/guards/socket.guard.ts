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
    //this.router.navigate(['/offline']);
    //TODO: navegar a otra pagina cuando los sockets esten offline y hasta que no lo estyen que esto no se ponga a true.
    console.log("check");
    return  true;
  }
}
