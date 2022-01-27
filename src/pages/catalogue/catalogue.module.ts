import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { CataloguePage } from './catalogue';

@NgModule({
  declarations: [
    CataloguePage,
  ],
  imports: [
    IonicPageModule.forChild(CataloguePage),
  ],
})
export class CataloguePageModule {}
