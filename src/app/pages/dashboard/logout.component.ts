import {Component} from '@angular/core';
import {Router} from '@angular/router';
import {SessionService} from '../../services/session.service';

@Component({
  selector: 'ngx-login',
  template: '',
})
export class LogoutComponent {
  constructor(private router: Router, private auth: SessionService) {
    this.auth.logout();
  }
}
