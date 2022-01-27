import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { ProdukPage } from './produk';

@NgModule({
  declarations: [
    ProdukPage,
  ],
  imports: [
    IonicPageModule.forChild(ProdukPage),
  ],
})
export class ProdukPageModule {}
