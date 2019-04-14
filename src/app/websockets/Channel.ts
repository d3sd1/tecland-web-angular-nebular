import {Observable} from 'rxjs';
import {StompService} from '@stomp/ng2-stompjs';
import {Message} from '@stomp/stompjs';

export class Channel {
  private messages: Observable<Message>;
  private url = '';

  constructor(private connection: StompService, private channel: string, private isPrivateChannel: boolean) {
    this.url = channel;
    this.messages = this.connection.subscribe(
      (isPrivateChannel ? '/user' : '') + this.url,
      {jwt: localStorage.getItem('userSessionTL')}, // ITS A MUST LOCALSTORAGE HERE!
    );
  }

  public stream(): Observable<Message> {
    return this.messages;
  }

  public disconnect() {
    return this.messages = null;
  }

  public send(message: any): void {
    this.connection.publish(this.url, JSON.stringify(message));
  }
}
