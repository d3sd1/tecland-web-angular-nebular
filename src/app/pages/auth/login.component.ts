import {ChangeDetectorRef, Component} from '@angular/core';
import {Router} from '@angular/router';
import {Feathers} from '../../services/feathers.service';
import {NbAuthService, NbAuthSocialLink, NbLoginComponent} from '@nebular/auth';
import {Paginated} from '@feathersjs/feathers';
import {map} from 'rxjs/operators';

@Component({
  selector: 'ngx-login',
  templateUrl: './login.component.html',
})
export class NgxLoginComponent extends NbLoginComponent {
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
    private feathers: Feathers,
    router: Router,
    service: NbAuthService,
    cd: ChangeDetectorRef,
  ) {
    super(service, {}, cd, router);
    this.test();
  }

  test() {
    (this.feathers.service('tests'))
      .watch()
      .find().subscribe(
      x => console.log('Observer got a next value: ', x),
      err => console.error('Observer got an error: ' + err),
      () => console.log('Observer got a complete notification')
    )
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

    // try to authenticate with feathers
    this.feathers.authenticate({
      strategy: 'local',
      email,
      password,
    })
    // navigate to base URL on success
      .then(() => {
        this.submitted = false;
        this.showMessages.success = true;
        this.messages = ['¡Conexión satisfactoria!'];

        //this.router.navigate(['/']);
      })
      .catch(err => {
        this.submitted = false;
        this.showMessages.error = true;
        console.log(err.message);
        if (err.message === 'Socket connection timed out') {
          this.messages = ['Servidor desconectado'];
        } else {
          this.messages = ['Credenciales incorrectas'];
        }
      });
  }

}
