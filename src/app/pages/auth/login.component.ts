import {ChangeDetectorRef, Component} from '@angular/core';
import { Router } from '@angular/router';
import { Feathers } from '../../services/feathers.service';
import {NbAuthService, NbLoginComponent} from '@nebular/auth';

@Component({
  selector: 'ngx-login',
  templateUrl: './login.component.html',
})
export class NgxLoginComponent extends NbLoginComponent {
  messages: string[] = [];

  constructor(
    private feathers: Feathers,
    router: Router,
    service: NbAuthService,
    cd: ChangeDetectorRef,
  ) {
    super(service, {}, cd, router);
  }

  doLogin(email: string, password: string): void {
    if (!email || !password) {
      this.messages.push('Incomplete credentials!');
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
        this.messages.push('login ok');

        this.router.navigate(['/']);
      })
      .catch(err => {
        this.messages.unshift('Wrong credentials!');
      });
  }

  signup(email: string, password: string) {
    this.feathers.service('users')
      .create({email, password})
      .then(() => this.messages.push('User created.'))
      .catch(err => this.messages.push('Could not create user!'))
    ;
  }
}
