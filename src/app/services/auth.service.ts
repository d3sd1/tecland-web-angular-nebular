import {WebsocketClient} from '../websockets/websocket-client.service';
import {Injectable} from '@angular/core';
import {Message} from '@stomp/stompjs';
import {NbGlobalPhysicalPosition, NbToastrService} from '@nebular/theme';
import {NbToastStatus} from '@nebular/theme/components/toastr/model';

/**
 * Abstraction layer for auth. Nice to have when things get more complicated.
 */
@Injectable()
export class AuthService {

  private userSessionChannel;
  private isUserAuth: boolean = false;

  constructor(private ws: WebsocketClient, private toastrService: NbToastrService) {
    console.log("create user sess chan");
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
          } else if (resp.statusCode === 401) { // Logged smw else
            localStorage.setItem('userSessionTL', '');
            this.toastrService.show(
              'Conectado desde otro equipo. ',
              `Desconexión por seguridad.`,
              {
                position: NbGlobalPhysicalPosition.BOTTOM_RIGHT,
                status: NbToastStatus.WARNING,
                duration: 10000,
                preventDuplicates: true,
                destroyByClick: false
              });
            resolve(false);
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
