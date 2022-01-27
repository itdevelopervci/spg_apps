import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { CataloguedetailPage } from './cataloguedetail';

@NgModule({
  declarations: [
    CataloguedetailPage,
  ],
  imports: [
    IonicPageModule.forChild(CataloguedetailPage),
  ],
})
export class CataloguedetailPageModule {}
