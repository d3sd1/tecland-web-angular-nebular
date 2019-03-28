import {Injectable} from '@angular/core';
import {CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router} from '@angular/router';
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
        console.log("VAMONOS XDDDDDDDDDD");
        this.auth.isLoggedIn().then((connected: boolean) => {
          console.log("hola aaaaa a ", connected);
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
