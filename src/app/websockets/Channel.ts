import {Observable} from 'rxjs';
import {StompService} from '@stomp/ng2-stompjs';
import {Message} from '@stomp/stompjs';

export class Channel {
  private messages: Observable<Message>;
  private url = '';
  private sessionId = '';

  constructor(private connection: StompService, private channel: string, private isPrivateChannel: boolean) {
    this.url = channel;
    this.sessionId = '_' + Math.random().toString(36).substr(2, 9)
      + require('uuid').v4()
      + (Math.random().toString(36) + '00000000000000000').slice(2, 30 + 2);
    this.messages = this.connection.subscribe(
      this.url + (this.isPrivateChannel ? '/' + this.sessionId : ''),
      {sessionId: this.sessionId}
    )
  }

  public stream(): Observable<Message> {
    return this.messages;
  }

  public send(message: any): void {
    this.connection.publish(this.url, JSON.stringify(message),
      {sessionId: this.sessionId});
  }
}
