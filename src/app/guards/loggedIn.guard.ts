import {Injectable} from '@angular/core';
import {ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot} from '@angular/router';
import {Observable} from 'rxjs';
import {AuthService} from '../services/auth.service';


@Injectable()
export class LoggedInGuard implements CanActivate {
  constructor(private router: Router, private auth: AuthService) {
  }

  canActivate(next: ActivatedRouteSnapshot,
              state: RouterStateSnapshot): Observable<boolean> | Promise<boolean> | boolean {
    let poolChecker = null;
    return new Observable<boolean>(observer => {
      poolChecker = setInterval(() => {
        this.auth.isLoggedIn().then((connected: boolean) => {
          if (!connected) {
            clearInterval(poolChecker);
            this.router.navigate(['/auth/login']);
          }
          observer.next(connected);
        });
      }, 1000);
    });
  }
}
