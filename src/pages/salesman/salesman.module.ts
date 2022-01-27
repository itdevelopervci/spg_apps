import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { SalesmanPage } from './salesman';

@NgModule({
  declarations: [
    SalesmanPage,
  ],
  imports: [
    IonicPageModule.forChild(SalesmanPage),
  ],
})
export class SalesmanPageModule {}
