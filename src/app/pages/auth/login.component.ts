import {ChangeDetectorRef, Component} from '@angular/core';
import {Router} from '@angular/router';
import {WebsocketClient} from '../../websockets/websocket-client.service';
import {NbAuthService, NbLoginComponent} from '@nebular/auth';
import {Channel} from '../../websockets/Channel';
import {LocationService} from '../../services/location.service';
import {SessionService} from '../../services/session.service';
import {WebsocketRoute} from '../../websockets/WebsocketRoute';


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
    'success': false,
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
    private location: LocationService,
    private auth: SessionService,
  ) {
    super(service, {}, cd, router);

    this.loginChannel = this.ws.subscribe(WebsocketRoute.LOGIN, true);

    this.loginChannel.stream((data) => {
      this.submitted = false;
      this.connected = true;
      this.showMessages.success = true;
      this.messages = ['¡Conexión satisfactoria!'];
      this.auth.login(data.jwt);
    }, (resp) => {
      this.submitted = false;
      this.showMessages.error = true;
      this.messages = ['Credenciales incorrectas'];
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
        'coordsLng': this.lng,
      });
    }
  }

}
