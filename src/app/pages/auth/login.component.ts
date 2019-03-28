import {ChangeDetectorRef, Component} from '@angular/core';
import {Router} from '@angular/router';
import {WebsocketClient} from '../../websockets/websocket-client.service';
import {NbAuthService, NbLoginComponent} from '@nebular/auth';
import {Channel} from '../../websockets/Channel';
import {Message} from '@stomp/stompjs';
import {LocationService} from '../../services/location.service';


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
  private lat: number = -1;
  private lng: number = -1;
  showMessages: any = {
    'error': false,
    'success': false
  };
  errors: string[] = [];
  user: any;
  submitted: boolean = false;
  connected: boolean = false;

  constructor(
    private ws: WebsocketClient,
    router: Router,
    service: NbAuthService,
    cd: ChangeDetectorRef,
    private location: LocationService
  ) {
    super(service, {}, cd, router);

    this.loginChannel = this.ws.subscribe('/dash/login', true);
    this.loginChannel.stream().subscribe((message: Message) => {
      const resp = JSON.parse(message.body);
      if (resp.statusCode === 200) {
        this.submitted = false;
        this.connected = true;
        this.showMessages.success = true;
        this.messages = ['¡Conexión satisfactoria!'];

        localStorage.setItem('userSessionTL', resp.data);

        //se supone que esto deberia redirigir TODO:
        this.router.navigate(['/dash/dashboard']);
      } else {
        this.submitted = false;
        this.showMessages.error = true;
        this.messages = ['Credenciales incorrectas'];

      }
    });

    this.location.getPosition().then(pos => {
      this.lat = pos.lat;
      this.lng = pos.lng;
    });
  }

  login(): void {
    if (!this.connected) {
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

      this.loginChannel.send({
        'dashUser': this.user,
        'coordsLat': this.lat,
        'coordsLng': this.lng
      });
    }
  }

}
