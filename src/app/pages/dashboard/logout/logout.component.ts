import {Component} from '@angular/core';
import {Router} from '@angular/router';
import {SessionService} from '../../../services/session.service';

@Component({
  selector: 'ngx-login',
  styleUrls: ['./logout.component.scss'],
  templateUrl: './logout.component.html',
})
export class LogoutComponent {
  constructor(private router: Router, private auth: SessionService) {
    this.auth.logout();
  }
}
