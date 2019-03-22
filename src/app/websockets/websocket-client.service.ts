import {Injectable, isDevMode} from '@angular/core';
import {StompConfig, StompService, StompState} from '@stomp/ng2-stompjs';
import {BehaviorSubject} from 'rxjs';
import {Channel} from './Channel';
import 'rxjs-compat/add/operator/map';
import { Subject } from 'rxjs/Rx';

@Injectable({
  providedIn: 'root',
})
export class WebsocketClient {
  private connection: StompService = null;
  private connected: Promise<boolean>;
  constructor() {
    this.getConnection();
  }

  public isConnected(): Promise<boolean> {
    return this.connected;
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
        debug: isDevMode()
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
