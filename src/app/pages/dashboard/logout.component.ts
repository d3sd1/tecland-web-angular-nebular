import {Component} from '@angular/core';
import {Router} from '@angular/router';

@Component({
  selector: 'ngx-login',
  template: ''
})
export class LogoutComponent {
  constructor(private router: Router) {
    localStorage.setItem('userSessionTL', '');
    this.router.navigate(['/auth/login']);
  }
}
