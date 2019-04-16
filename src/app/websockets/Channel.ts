import {Observable, Subscription} from 'rxjs';
import {StompService, StompState} from '@stomp/ng2-stompjs';
import {Message} from '@stomp/stompjs';

export class Channel {
  private messages: Observable<Message>;
  private subscriptions: Subscription[];
  private conStateHandler: Subscription;

  constructor(private connection: StompService, private channel: string, private isPrivateChannel: boolean) {
    this.subscriptions = [];
    this.messages = this.connection.subscribe(
      (isPrivateChannel ? '/user' : '') + this.channel,
    );

    /* Prevent duplicated queues after multiple reconnections (also prevent multiple disconnecting* */
    this.conStateHandler = this.connection.connectionState$.map(
      (state: number) => StompState[state]).subscribe((status: string) => {
      if (status === 'DISCONNECTING') {
        this.disconnect();
        this.conStateHandler.unsubscribe();
      }
    });
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
    this.connection.publish(this.channel, JSON.stringify(message));
  }
}
