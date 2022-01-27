import { Component, ElementRef, ViewChild } from '@angular/core';
import { IonicPage, NavController, NavParams, AlertController, LoadingController, ToastController } from 'ionic-angular';
// import { Storage } from '@ionic/Storage';
import { PostProvider } from '../../providers/post-provider';


@IonicPage()
@Component({
  selector: 'page-cuti',
  templateUrl: 'cuti.html',
})
export class CutiPage {

  @ViewChild('myInput') myInput: ElementRef;

  startDate: String = new Date().toISOString();

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    // private storage: Storage,
    public alertCtrl: AlertController,
    public postPvdr: PostProvider,
    public loadingCtrl: LoadingController,
    public toastCtrl: ToastController
  ) {

  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad CutiPage');
  }

}
