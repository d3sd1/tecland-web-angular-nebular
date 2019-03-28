import {NbMenuService} from '@nebular/theme';
import {Component} from '@angular/core';
import {Router} from '@angular/router';
import {Observable} from 'rxjs';
import {WebsocketClient} from '../../../websockets/websocket-client.service';

@Component({
  selector: 'ngx-E404',
  styleUrls: ['./E404.component.scss'],
  templateUrl: './E404.component.html',
})
export class E404Component {

  constructor(private menuService: NbMenuService, private router: Router, private ws: WebsocketClient) {}
}
