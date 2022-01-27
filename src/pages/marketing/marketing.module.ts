import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { MarketingPage } from './marketing';

@NgModule({
  declarations: [
    MarketingPage,
  ],
  imports: [
    IonicPageModule.forChild(MarketingPage),
  ],
})
export class MarketingPageModule {}
