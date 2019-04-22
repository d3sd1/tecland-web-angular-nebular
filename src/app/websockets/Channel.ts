import {Observable, Subscription} from 'rxjs';
import {StompService} from '@stomp/ng2-stompjs';
import {Message} from '@stomp/stompjs';
import {Injectable} from '@angular/core';
import {NbGlobalPhysicalPosition, NbToastrService} from '@nebular/theme';
import {NbToastStatus} from '@nebular/theme/components/toastr/model';

@Injectable()
export class Channel {
  private messages: Observable<Message>;
  private subscriptions: Subscription[];

  constructor(private connection: StompService,
              private channel: string,
              private isPrivateChannel: boolean,
              private toastrService: NbToastrService) {
    this.subscriptions = [];
    this.messages = this.connection.subscribe(
      (isPrivateChannel ? '/user' : '') + this.channel,
      {'jwt_session': localStorage.getItem('userSessionTL')},
    );
  }

  public stream(success: any, genericErr = null, permissionErr = null): Subscription {
    const sub: Subscription = this.messages.subscribe((message: Message) => {
      const resp = JSON.parse(message.body);
      if (resp.statusCode === 200) {
        success(resp.data);
      } else if (resp.statusCode === 401) {
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
        if (null !== permissionErr) {
          permissionErr(resp.data);
        }
      } else if (resp.statusCode === 403) {
        if (null !== permissionErr) {
          genericErr(resp.data);
        }
      }
    });
    this.subscriptions.push(sub);
    return sub;
  }

  public disconnect() {
    this.subscriptions.forEach((sub: Subscription) => {
      sub.unsubscribe();
    });
    this.subscriptions = [];
    this.messages = null;
  }

  public send(message: any): void {
    this.connection.publish(
      this.channel,
      JSON.stringify(message),
      {'jwt_session': localStorage.getItem('userSessionTL')},
    );
  }
}
