import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { PagetestPage } from './pagetest';

@NgModule({
  declarations: [
    PagetestPage,
  ],
  imports: [
    IonicPageModule.forChild(PagetestPage),
  ],
})
export class PagetestPageModule {}
