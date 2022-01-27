import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { FingerlessPage } from './fingerless';

@NgModule({
  declarations: [
    FingerlessPage,
  ],
  imports: [
    IonicPageModule.forChild(FingerlessPage),
  ],
})
export class FingerlessPageModule {}
