import {ChangeDetectorRef, Component} from '@angular/core';
import {Router} from '@angular/router';
import {WebsocketClient} from '../../websockets/websocket-client.service';
import {NbAuthService, NbLoginComponent} from '@nebular/auth';
import {Channel} from '../../websockets/Channel';
import {Message} from '@stomp/stompjs';


@Component({
  selector: 'ngx-login',
  templateUrl: './login.component.html',
})
export class NgxLoginComponent extends NbLoginComponent {
  loginChannel: Channel;
  messages: string[] = [];
  protected service: NbAuthService;
  protected options: {};
  protected cd: ChangeDetectorRef;
  protected router: Router;
  showMessages: any = {
    'error': false,
    'success': false
  };
  errors: string[] = [];
  user: any;
  submitted: boolean = false;

  constructor(
    private ws: WebsocketClient,
    router: Router,
    service: NbAuthService,
    cd: ChangeDetectorRef,
  ) {
    super(service, {}, cd, router);

    this.loginChannel = this.ws.subscribe('/login', true);
    this.loginChannel.stream().subscribe((message: Message) => {
      let resp = JSON.parse(message.body);
      console.log();
      if (resp.statusCode === 200) {
        this.showMessages.success = true;
        this.messages = ['¡Conexión satisfactoria!'];
        //TODO: guardar en storage el token

        //this.router.navigate(['/']);
      } else {
        this.submitted = false;
        this.showMessages.error = true;
        this.messages = ['Credenciales incorrectas'];

      }
    });
  }

  login(): void {

    this.submitted = true;
    this.showMessages.success = false;
    this.showMessages.error = false;
    const email = this.user.email;
    const password = this.user.password;
    if (!email || !password) {
      this.showMessages.error = true;
      this.messages = ['Debes rellenar el formulario de conexión.'];
      this.submitted = false;
      return;
    }

    this.loginChannel.send(this.user);

    // push aqui

  }

}
