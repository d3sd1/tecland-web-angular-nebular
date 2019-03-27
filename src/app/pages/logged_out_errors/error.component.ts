import { Component } from '@angular/core';

@Component({
  selector: 'ngx-miscellaneous',
  template: `
    <router-outlet></router-outlet>
    <nb-layout style="display: none"></nb-layout>
  `,
})
export class ErrorComponent {
}
