import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { MapsviewerPage } from './mapsviewer';

@NgModule({
  declarations: [
    MapsviewerPage,
  ],
  imports: [
    IonicPageModule.forChild(MapsviewerPage),
  ],
})
export class MapsviewerPageModule {}
