import {Injectable, isDevMode} from '@angular/core';
import {StompConfig, StompService, StompState} from '@stomp/ng2-stompjs';
import {BehaviorSubject, Observable} from 'rxjs';
import {Channel} from './Channel';
import 'rxjs-compat/add/operator/map';

@Injectable({
  providedIn: 'root',
})
export class WebsocketClient {
  private connection: StompService = null;
  private connected: boolean;
  constructor() {
    this.getConnection();
    this.connected = false;
  }

  public isConnected(): Observable<boolean> {
    return new Observable(ob => {ob.next(this.connected); });
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
    this.connection.connectionState$.map((state: number) => StompState[state]).subscribe((status: string) => {
      console.log(status);
      //TODO: aqui redirigir a pagina de reconexion cuando no este conectado y cuando este conectado a la ultima pagina visitada.
      //TODO. que cuando el usuario entre a la pagina le cargue por defecto la ultima pagina visitada.
      if (status !== 'OPEN' && status !== 'CONNECTING' && !this.connection.connected()) {
        this.connected = false;
      }
      else {
        this.connected = true;
      }
    });
    console.log(this.connected);
    return this.connection;

  }

  public subscribe(channel: string, isPrivateChannel: boolean): Channel {
    return new Channel(this.connection, channel, isPrivateChannel);
  }

  public state(): BehaviorSubject<StompState> {
    return this.connection.state;
  }
}
