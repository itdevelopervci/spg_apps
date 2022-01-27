import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { OutletPage } from './outlet';

@NgModule({
  declarations: [
    OutletPage,
  ],
  imports: [
    IonicPageModule.forChild(OutletPage),
  ],
})
export class OutletPageModule {}
