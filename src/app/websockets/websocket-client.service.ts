import {Injectable} from '@angular/core';
import {StompConfig, StompService, StompState} from '@stomp/ng2-stompjs';
import {BehaviorSubject, Observable} from 'rxjs';
import {Channel} from './Channel';

@Injectable({
  providedIn: 'root',
})
export class WebsocketClient {
  private connection: StompService = null;

  constructor() {
    this.getConnection();
  }

  private getConnection() {
    if (this.connection === null) {
      const WEBSOCKET_URL = 'ws://localhost:8080/socket';
      const stompConfig: StompConfig = {
        url: WEBSOCKET_URL,
        headers: {
          login: '',
          passcode: ''
        },
        heartbeat_in: 0,
        heartbeat_out: 20000,
        reconnect_delay: 5000,
        debug: true
      };

      this.connection = new StompService(stompConfig);
    }
    return this.connection;
  }

  public subscribe(channel: string, isPrivateChannel: boolean): Channel {
    return new Channel(this.connection, channel, isPrivateChannel);
  }
  public state(): BehaviorSubject<StompState> {
    return this.connection.state;
  }
}
