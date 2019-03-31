import {WebsocketClient} from '../websockets/websocket-client.service';
import {Injectable} from '@angular/core';
import {Message} from '@stomp/stompjs';

/**
 * Abstraction layer for auth. Nice to have when things get more complicated.
 */
@Injectable()
export class AuthService {

  private userSessionChannel;
  private isUserAuth: boolean = false;

  constructor(private ws: WebsocketClient) {
    this.userSessionChannel = this.ws.subscribe('/dash/jwt/session', true);
  }

  public isLoggedIn(): Promise<boolean> {
    return new Promise<boolean>((resolve, reject) => {
      if (localStorage.getItem('userSessionTL') === '') {
        resolve(false);
      } else {
        this.userSessionChannel.stream().subscribe((message: Message) => {
          const resp = JSON.parse(message.body);
          if (resp.statusCode === 200) {
            resolve(true);
          } else {
            localStorage.setItem('userSessionTL', '');
            resolve(false);
          }
        });
        this.userSessionChannel.send({
          'jwt': localStorage.getItem('userSessionTL')
        });
      }
    });
  }
}
