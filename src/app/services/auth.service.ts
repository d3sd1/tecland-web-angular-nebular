import { WebsocketClient } from '../websockets/websocket-client.service';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';

/**
 * Abstraction layer for auth. Nice to have when things get more complicated.
 */
@Injectable()
export class AuthService {

  constructor(private feathers: WebsocketClient, private router: Router) {}

  public logIn(credentials?) { // : Promise<any>
    //TODO
  }

  public logOut() {
    //TODO
  }
}
