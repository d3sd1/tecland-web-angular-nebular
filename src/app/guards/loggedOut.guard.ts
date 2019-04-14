import {Injectable} from '@angular/core';
import {ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot} from '@angular/router';
import {Observable} from 'rxjs';
import {SessionService} from '../services/session.service';
import {AppCommonRoutes} from '../app-common-routes';


@Injectable()
export class LoggedOutGuard implements CanActivate {
  constructor(private router: Router, private auth: SessionService) {
  }

  canActivate(next: ActivatedRouteSnapshot,
              state: RouterStateSnapshot): Observable<boolean> | Promise<boolean> | boolean {
    const sessExpired = this.auth.isSessionExpired();
    if (!sessExpired) {
      this.router.navigate([AppCommonRoutes.dashDefaultInitPage]);
    } else {
      /* End session handler just for preventing missing object references to channel¡s and optimize */
      this.auth.endSessionHandler();
    }
    return sessExpired;
  }
}
