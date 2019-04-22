import {Injectable} from '@angular/core';
import {JwtSession} from '../model/JwtSession';
import {JwtHelperService} from '@auth0/angular-jwt';

@Injectable()
export class JwtStorageService {

  public getSessionJwt(): string {
    return localStorage.getItem('userSessionTL');
  }

  public setSessionJwt(jwt: string) {
    localStorage.setItem('userSessionTL', jwt);
  }

  public isSessionExpired(): boolean {
    return this.decodeSessionJwt().expired;
  }

  public decodeSessionJwt(): JwtSession {
    const jwtSession = new JwtSession();
    try {
      const helper = new JwtHelperService();
      const jwt = this.getSessionJwt();

      jwtSession.data = helper.decodeToken(jwt);
      jwtSession.expired = helper.isTokenExpired(jwt);
      jwtSession.expirationDate = helper.getTokenExpirationDate(jwt);
    } catch (e) {
      jwtSession.data = null;
      jwtSession.expired = true;
      jwtSession.expirationDate = new Date();
    }

    return jwtSession;
  }

  public clearSessionJwt() {
    this.setSessionJwt('');
  }
}
