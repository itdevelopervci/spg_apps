import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ToastController, LoadingController, AlertController, Platform } from 'ionic-angular';
import { PostProvider } from '../../providers/post-provider';
import { Storage } from '@ionic/Storage';
// import { HomePage } from '../home/home';
import { StatusBar } from '@ionic-native/status-bar';
import { ApplyserverPage } from '../applyserver/applyserver';
import { AppVersion } from '@ionic-native/app-version';





@IonicPage()
@Component({
  selector: 'page-login',
  templateUrl: 'login.html',
})
export class LoginPage {

  username: string = "";
  password: string = "";
  loader: any;
  versi: any;


  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    public toastCtrl: ToastController,
    public loadingCtrl: LoadingController,
    public postPvdr: PostProvider,
    public alertCtrl: AlertController,
    public storage: Storage,
    public statusBar: StatusBar,
    private appVersion: AppVersion,
    private platform: Platform
  ) {

    this.statusBar.backgroundColorByHexString('#ffffff');
    this.statusBar.styleDefault();

    this.platform.ready().then(() => {
      if (this.platform.is('android')) {
        this.appVersion.getVersionNumber().then((res) => {
          console.log(res);
          this.versi = res;
        }, (err) => {
          console.log(err);
        });
      } else {
        this.versi = '0';
      }
    });

  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad LoginPage');
  }

  async presentLoading() {
    this.loader = await this.loadingCtrl.create({
      content: "",
      // duration: 2000
    });
    return await this.loader.present();
  }

  Login() {

    if (this.username == "" && this.password == "") {

      const toast = this.toastCtrl.create({
        message: 'Username dan Password tidak boleh kosong.',
        duration: 3000,
        position: 'top'
      });
      toast.present();

    } else if (this.username == "" || this.password == "") {

      const toast = this.toastCtrl.create({
        message: 'Username atau Password tidak boleh kosong.',
        duration: 3000,
        position: 'top'
      });
      toast.present();

    } else {

      console.log('Password : ', this.password);

      let body = {
        username: this.username,
        password: this.password,
        aksi: 'login_system'
      };

      this.presentLoading();
      this.postPvdr.postDataLogin(body, 'Login').subscribe((data) => {

        var alertpesan = data.msg;
        if (data.success) {

          this.storage.set('session_user_login', data.result);
          this.loader.dismiss();
          this.getUserSalesman();
          // this.navCtrl.setRoot(HomePage);
          this.navCtrl.push(ApplyserverPage);

        } else {

          this.loader.dismiss();
          const toast = this.toastCtrl.create({
            message: alertpesan,
            duration: 2000,
            position: 'top'
          });
          toast.present();

        }
      }, error => {

        this.loader.dismiss();
        const alert = this.alertCtrl.create
          ({

            title: 'Pehatian',
            subTitle: 'Internet tidak tersambung, cek kembali signal atau kuota internet Anda.',
            buttons: ['OK']

          });
        alert.present();
      });

    }

  }

  getUserSalesman() {

    let body = {
      username: this.username,
      aksi: 'login_application'
    };
    this.postPvdr.postDataLogin(body, 'LoginApplication').subscribe((data) => {
      if (data.success) {
        this.storage.set('session_user_salesman', data.result);
        // this.storage.set('session_user_distribution', data.result);
      }
    });
  }

  getUserDistribution() {

    let body = {
      username: this.username,
      aksi: 'login_application'
    };
    this.postPvdr.postData(body, 'LoginApplication').subscribe((data) => {
      if (data.success) {
        this.storage.set('session_user_distribution', data.result);
      }
    });
  }

}
