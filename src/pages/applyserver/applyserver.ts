import { Component } from '@angular/core';
import { AlertController, IonicPage, NavController, NavParams, Platform } from 'ionic-angular';
import { Storage } from '@ionic/Storage';
import { LoginPage } from '../login/login';

@IonicPage()
@Component({
  selector: 'page-applyserver',
  templateUrl: 'applyserver.html',
})
export class ApplyserverPage {

  full_name: any;
  username: any;
  kdsales: any;
  kdcabang: any;
  namacabang: any;
  namadepo: any;
  NamaServer: any;
  ServerAddress: any;

  constructor(
    public navCtrl: NavController,
    private storage: Storage,
    public platform: Platform,
    public alertCtrl: AlertController,
    public navParams: NavParams) {

      // this is constructor

  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad ApplyserverPage');
  }

  ionViewDidEnter() {
    this.storage.get('session_user_login').then((res) => {
      this.full_name = res[0].employee_name;
      this.username = res[0].username;
      // console.log('Nama ', this.full_name);
    });

    this.storage.get('session_user_salesman').then((res) => {
      this.kdcabang = res[0].KdCabang;
      this.namacabang = res[0].NamaCabang;
      this.namadepo = res[0].NamaDepo;
      this.kdsales = res[0].KdSales;
      this.NamaServer = res[0].NamaServer;
      this.ServerAddress = res[0].ServerAddress;
      // console.log('Server address ', this.ServerAddress)
    });
  }

  setServer() {
    if (this.ServerAddress == '') {
      const alert = this.alertCtrl.create({
        subTitle: 'Server tidak ditemukan, silahkan login kembali.',
        buttons: [
          {
            text: 'Oke',
            handler: () => {
              this.navCtrl.pop();
            }
          }
        ]
      });
      alert.present();
    } else {
      this.storage.set('server', this.ServerAddress);
      this.showAlert();
    }
  }

  showAlert() {
    const alert = this.alertCtrl.create({
      title: 'Konfirmasi',
      subTitle: 'Simpan pengaturan ini?',
      buttons: [
        {
          text: 'Oke',
          handler: () => {
            this.platform.exitApp();
            console.log('exiting app....')
          }
        }
      ]
    });
    alert.present();
  }

  backToLogin() {
    this.storage.clear();
    this.navCtrl.setRoot(LoginPage);
  }



}
