import {Injectable, isDevMode} from '@angular/core';
import {StompConfig, StompService, StompState} from '@stomp/ng2-stompjs';
import {BehaviorSubject} from 'rxjs';
import {Channel} from './Channel';
import 'rxjs-compat/add/operator/map';
import {environment} from '../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class WebsocketClient {
  private connection: StompService = null;
  private connected: boolean;
  private prevConnected: boolean;

  constructor() {
    this.getConnection();
    this.connected = false;
    this.prevConnected = false;
  }

  public isConnected() {
    return this.connected;
  }

  public wasConnected() {
    return this.prevConnected;
  }

  public setPrevConnected(connected: boolean) {
    this.prevConnected = connected;
  }

  public isSocketOnline() {
    const online = this.isConnected();
    if (online && !this.wasConnected()) {
      this.setPrevConnected(true);
    } else if (!online) {
      this.setPrevConnected(false);
    }
    return online;
  }

  private getConnection() {
    if (this.connection === null) {
      const WEBSOCKET_URL = 'ws://localhost:' + environment.socketPort + '/opencon';
      const stompConfig: StompConfig = {
        url: WEBSOCKET_URL,
        headers: {
          login: '',
          passcode: '',
        },
        heartbeat_in: 0,
        heartbeat_out: 20000,
        reconnect_delay: 5000,
        debug: isDevMode(),
      };

      this.connection = new StompService(stompConfig);

    }
    this.connection.connectionState$.map((state: number) => StompState[state]).subscribe((status: string) => {
      if (status !== 'OPEN' && status !== 'CONNECTING' && !this.connection.connected()) {
        this.connected = false;
      } else {
        this.connected = true;
      }
    });
    return this.connection;

  }

  public subscribe(channel: string, isPrivateChannel: boolean): Channel {
    return new Channel(this.connection, channel, isPrivateChannel);
  }

  public state(): BehaviorSubject<StompState> {
    return this.connection.state;
  }
}
