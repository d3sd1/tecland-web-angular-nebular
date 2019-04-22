import {Observable, Subscription} from 'rxjs';
import {StompService} from '@stomp/ng2-stompjs';
import {Message} from '@stomp/stompjs';
import {Injectable} from '@angular/core';

@Injectable()
export class Channel {
  private messages: Observable<Message>;
  private subscriptions: Subscription[];

  constructor(private connection: StompService,
              private channel: string,
              private isPrivateChannel: boolean) {
    this.subscriptions = [];
    this.messages = this.connection.subscribe(
      (isPrivateChannel ? '/user' : '') + this.channel,
      {'jwt_session': localStorage.getItem('userSessionTL')},
    );
  }

  public stream(codeBlock: any): Subscription {
    const sub: Subscription = this.messages.subscribe((message: Message) => {
      codeBlock(message);
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
