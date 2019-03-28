import {Injectable} from '@angular/core';
import {CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router} from '@angular/router';
import {Observable} from 'rxjs';
import {AuthService} from '../services/auth.service';


@Injectable()
export class LoggedOutGuard implements CanActivate {
  constructor(private router: Router, private auth: AuthService) {
  }

  canActivate(next: ActivatedRouteSnapshot,
              state: RouterStateSnapshot): Observable<boolean> | Promise<boolean> | boolean {
    let poolChecker = null;
    return new Observable<boolean>(observer => {
      poolChecker = setInterval(() => {
        this.auth.isLoggedIn().then((connected: boolean) => {
          console.log("CON: " + connected);
          if (connected) {
            clearInterval(poolChecker);
            this.router.navigate(['/dash/dashboard']);
          }
          observer.next(!connected);
        });
      }, 1000);
    });
  }
}
