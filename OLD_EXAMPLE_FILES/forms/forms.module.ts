import { NgModule } from '@angular/core';

import { ThemeModule } from '../../src/app/@theme/theme.module';
import { FormsRoutingModule, routedComponents } from './forms-routing.module';
import { ButtonsModule } from './buttons/buttons.module';

@NgModule({
  imports: [
    ThemeModule,
    FormsRoutingModule,
    ButtonsModule,
  ],
  declarations: [
    ...routedComponents,
  ],
})
export class FormsModule { }
