import {Injectable} from '@angular/core';
import {ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot} from '@angular/router';
import {Observable} from 'rxjs';
import {SessionService} from '../services/session.service';
import {AppCommonRoutes} from '../app-common-routes';


@Injectable()
export class LoggedInGuard implements CanActivate {
  constructor(private router: Router, private auth: SessionService) {
  }

  canActivate(next: ActivatedRouteSnapshot,
              state: RouterStateSnapshot): Observable<boolean> | Promise<boolean> | boolean {
    const sessExpired = this.auth.isSessionExpired();
    // TODO: timeout para llamar a sessExpired. es decir, comprobar que se desconecta cuando el token caduca.
    if (sessExpired) {
      this.router.navigate([AppCommonRoutes.login]);
    } else {
      /* Init session handler for disconnecting everyone that goes session when other is connected on same user */
      this.auth.initSessionHandler();
    }
    return !sessExpired;
  }
}
