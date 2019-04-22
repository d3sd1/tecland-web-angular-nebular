import {Injectable, isDevMode} from '@angular/core';
import {StompConfig, StompService, StompState} from '@stomp/ng2-stompjs';
import {IFrame} from '@stomp/stompjs';
import {BehaviorSubject, Subscription} from 'rxjs';
import {Channel} from './Channel';
import 'rxjs-compat/add/operator/map';
import {environment} from '../../environments/environment';
import {AppCommonRoutes} from '../app-common-routes';
import {JwtStorageService} from '../services/jwt.storage.service';
import {Router} from '@angular/router';
import {NbGlobalPhysicalPosition, NbToastrService} from '@nebular/theme';
import {NbToastStatus} from '@nebular/theme/components/toastr/model';

@Injectable({
  providedIn: 'root',
})
export class WebsocketClient {
  private connection: StompService = null;
  private connected: boolean;
  private prevConnected: boolean;
  private conStateHandler: Subscription;
  private channels: Channel[];

  constructor(
    private jwtMan: JwtStorageService,
    private router: Router,
    private toastrService: NbToastrService,
  ) {
    this.getConnection();
    this.connected = false;
    this.prevConnected = false;
    this.channels = [];
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

  private disconnect() {
    this.channels.forEach((channel: Channel) => {
      channel.disconnect();
    });
    this.channels = [];
    this.conStateHandler.unsubscribe();
  }

  public subscribe(channel: string, isPrivateChannel: boolean): Channel {
    return new Channel(this.connection, channel, isPrivateChannel, this.toastrService);
  }

  private getConnection() {
    if (this.connection === null) {
      const WEBSOCKET_URL = 'ws://localhost:' + environment.socketPort + '/opencon';
      const stompConfig: StompConfig = {
        url: WEBSOCKET_URL,
        headers: {},
        heartbeat_in: 0,
        heartbeat_out: 20000,
        reconnect_delay: 5000,
        debug: isDevMode(),
      };
      this.connection = new StompService(stompConfig);
    }
    this.conStateHandler = this.connection.connectionState$.map(
      (state: number) => StompState[state]).subscribe((status: string) => {
      if (status !== 'OPEN' && status !== 'CONNECTING' && !this.connection.connected()) {
        this.connected = false;
      } else if (status === 'DISCONNECTING') {
        /* Prevent duplicated queues after multiple reconnections (also prevent multiple disconnecting */
        this.disconnect();
        this.connected = false;
      } else {
        this.connected = true;
      }
    });

    this.connection.stompErrors$.subscribe((message: IFrame) => {
      switch (message.headers.message) {
        case 'DISCONNECT':
          this.disconnect();
          this.jwtMan.clearSessionJwt();
          this.router.navigate([AppCommonRoutes.login]).then(() => {
            this.toastrService.show(
              'Sesión expirada.',
              `Tu sesión ha caducado o se ha invalidado.`,
              {
                position: NbGlobalPhysicalPosition.BOTTOM_RIGHT,
                status: NbToastStatus.WARNING,
                duration: 10000,
                preventDuplicates: true,
                destroyByClick: false,
              });
          });
          break;
        case 'DISCONNECT_SILENTLY':
          this.disconnect();
          this.jwtMan.clearSessionJwt();
          this.router.navigate([AppCommonRoutes.login]);
          break;
        case 'PATH_NOT_FOUND':
          this.toastrService.show(
            'Ruta no encontrada',
            `Se ha solicitado una ruta no existente en el REST.`,
            {
              position: NbGlobalPhysicalPosition.BOTTOM_RIGHT,
              status: NbToastStatus.INFO,
              duration: 10000,
              preventDuplicates: true,
              destroyByClick: false,
            });
          break;
        case 'NO_PERMISSION':
          this.toastrService.show(
            'Sin permisos',
            `No tienes permisos para acceder al recurso solicitado.`,
            {
              position: NbGlobalPhysicalPosition.BOTTOM_RIGHT,
              status: NbToastStatus.DANGER,
              duration: 5000,
              preventDuplicates: true,
              destroyByClick: false,
            });
          break;
        default:
          console.error('Unhandled exception in websockets: ', message);
      }
    });

    return this.connection;

  }

  public state(): BehaviorSubject<StompState> {
    return this.connection.state;
  }
}
