import {Injectable} from '@angular/core';
import {ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot} from '@angular/router';
import {Observable} from 'rxjs';
import {SessionService} from '../services/session.service';
import {AppCommonRoutes} from '../app-common-routes';
import {NbGlobalPhysicalPosition, NbToastrService} from '@nebular/theme';
import {NbToastStatus} from '@nebular/theme/components/toastr/model';
import {JwtStorageService} from '../services/jwt.storage.service';


@Injectable()
export class LoggedInGuard implements CanActivate {
  constructor(private router: Router,
              private auth: SessionService,
              private toastrService: NbToastrService,
              private jwtMan: JwtStorageService) {
  }

  canActivate(next: ActivatedRouteSnapshot,
              state: RouterStateSnapshot): Observable<boolean> | Promise<boolean> | boolean {

    const sessExpired = this.jwtMan.isSessionExpired();
    if (sessExpired) {
      this.router.navigate([AppCommonRoutes.login]).then(() => {
        this.toastrService.show(
          'Sesión caducada',
          `Tu sesión ha finalizado.`,
          {
            position: NbGlobalPhysicalPosition.BOTTOM_RIGHT,
            status: NbToastStatus.WARNING,
            duration: 10000,
            preventDuplicates: true,
            destroyByClick: false,
          });
        /* Clear JWT to prevent "Connected from another device" when logging back */
        this.jwtMan.clearSessionJwt();
      });
    } else {
      /* Init session handler for disconnecting everyone that goes session when other is connected on same user */
      this.auth.initSessionHandler();
    }
    const msToExpire = this.auth.sessionExpireRemainMs();
    if (msToExpire > 0) {
      setTimeout(() => {
        this.canActivate(next, state);
      }, msToExpire);
    }
    return !sessExpired;
  }
}
