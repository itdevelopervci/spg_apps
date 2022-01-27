import { Component } from '@angular/core';
import { AlertController, IonicPage, LoadingController, NavController, NavParams, ToastController } from 'ionic-angular';
import { Storage } from '@ionic/Storage';
import { PostProvider } from '../../providers/post-provider';

import swal from 'sweetalert';
import { KunjunganPage } from '../kunjungan/kunjungan';
import { HistorycheckinPage } from '../historycheckin/historycheckin';
import { HistorytransPage } from '../historytrans/historytrans';
import { ProdukPage } from '../produk/produk';
import { OutletPage } from '../outlet/outlet';


@IonicPage()
@Component({
  selector: 'page-sellout',
  templateUrl: 'sellout.html',
})
export class SelloutPage {

  date = new Date();
  myDate: String = new Date(this.date.getTime() - this.date.getTimezoneOffset() * 60000).toISOString();
  todayDate: String = new Date().toISOString();
  today: any;
  daylight: any;
  bulan_aktif: any;
  tahun_aktif: any;

  // username
  full_name: any;
  username: any;
  total_sales: any;

  kdcabang: any;
  kdsales: any;
  kdgudang: any;
  iduser: any;
  tipe_user: any;

  loader: any;
  enable: any;
  isSync: any;



  constructor(
    private storage: Storage,
    public toastCtrl: ToastController,
    public alertCtrl: AlertController,
    public postPvdr: PostProvider,
    public loadingCtrl: LoadingController,
    public navCtrl: NavController,
    public navParams: NavParams) {

    this.total_sales = 0;

    // daylight
    var time = this.myDate.substring(11, 19)
    if (time >= '00:00:01' && time <= '10:00:00') {
      this.daylight = 'Pagi';
    } else if (time >= '10:00:00' && time <= '15:00:00') {
      this.daylight = 'Siang';
    } else if (time >= '15:00:00' && time <= '18:00:00') {
      this.daylight = 'Sore';
    } else if (time > '18:00:00') {
      this.daylight = 'Malam';
    }

    // username
    this.storage.get('session_user_login').then((res) => {
      this.full_name = res[0].employee_name;
      this.username = res[0].username;
    });

    this.storage.get('session_user_salesman').then((res) => {
      this.kdcabang = res[0].KdCabang;
      this.kdgudang = res[0].KdGudang;
      this.kdsales = res[0].KdSales;
      this.iduser = res[0].Id;
      this.tipe_user = res[0].KodeTipeUser;
    });

  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad SelloutPage');
  }

  ionViewDidEnter() {
    // this.getCheckVersionApp();
    // this.showMenuPane();
    // kalo beda tanggal harus sinkron
    this.today = this.todayDate.substring(0, 10);
    this.storage.get('isSync').then((res) => {
      this.isSync = res;
      console.log('Today : ', this.today);
      console.log('Sync : ', this.isSync);
      if (this.isSync != this.today || res == null) {
        this.removeSync();
        this.enable = 0;
        document.getElementById('sync').style.display = '';
        document.getElementById('sync_done').style.display = 'none';
      } else {
        this.enable = 1;
        this.isSync = this.today;
        document.getElementById('sync').style.display = 'none';
        document.getElementById('sync_done').style.display = '';
      }
    });

  }

  removeSync() {
    this.storage.remove('isSync');
  }

  //Inder Development
  underDevelopment() {
    const toast = this.toastCtrl.create({
      message: 'Menu ini masih dalam tahap pengembangan.',
      duration: 2000,
      position: 'bottom'
    });
    toast.present();
  }


  async presentLoading(x) {
    this.loader = await this.loadingCtrl.create({
      content: x,
      // duration: 2000
    });
    return await this.loader.present();
  }

  getSync() {
    this.storage.remove('outlet_temp');
    this.getMasterOutlet();
  }

  getMasterOutlet() {
    let body = {
      kdcabang: this.kdcabang,
      aksi: 'get_master_outlet'
    };
    this.presentLoading('Menyelaraskan data');
    this.postPvdr.postData(body, 'Outlet').subscribe((data) => {
      // this.showMenuPane();
      var alertpesan = data.msg;
      if (data.success) {
        this.storage.set('outlet', data.result);
        // console.log(data.result)
        this.getMasterProduct();
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
      // this.showMenuPane();
      const alert = this.alertCtrl.create
        ({
          title: 'Pehatian',
          subTitle: 'Tidak tersabung dengan Internet, cek kembali signal atau kuota internet anda',
          buttons: ['OK']
        });
      alert.present();
    });
  }

  getMasterProduct() {
    let body = {
      kdcabang: this.kdcabang,
      kdgudang: this.kdgudang,
      bulan_aktif: this.bulan_aktif,
      tahun_aktif: this.tahun_aktif,
      aksi: 'getProduct',
    };
    this.postPvdr.postData(body, 'Product').subscribe((data) => {
      var alertpesan = data.msg;
      if (data.success) {
        this.storage.set('produk', data.result);
        this.getMarketingTP();
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
          subTitle: 'Sinkronisasi produk gagal',
          buttons: ['OK']
        });
      alert.present();
    });
  }

  getMarketingTP() {
    let body = {
      aksi: 'getMarketingTP',
    };
    this.postPvdr.postData(body, 'MarketingTP').subscribe((data) => {
      var alertpesan = data.msg;
      if (data.success) {
        this.storage.set('marketingtp', data.result);
        this.getIdCheckin();
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
          subTitle: 'Sinkronisasi Marketing TP gagal.',
          buttons: ['OK']
        });
      alert.present();
    });
  }

  getIdCheckin() {
    let body = {
      kdsales: this.kdsales,
      kdcabang: this.kdcabang,
      aksi: 'get_idcheckin_spg',
    };
    this.postPvdr.postData(body, 'GetNoTrans').subscribe((data) => {
      var alertpesan = data.msg;
      if (data.success) {
        var idcekin = data.result;
        if (idcekin == null || idcekin == '' || idcekin == '0' || idcekin == 0) {
          this.storage.set('idcheckin', 0);
        } else {
          this.storage.set('idcheckin', idcekin);
          console.log('idcheckin', idcekin);
        }
        this.getNoSo();
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
          subTitle: 'Sinkronisasi get id check in gagal.',
          buttons: ['OK']
        });
      alert.present();
    });
  }

  getNoSo() {
    let body = {
      kdsales: this.kdsales,
      kdcabang: this.kdcabang,
      aksi: 'get_noso',
    };
    this.postPvdr.postData(body, 'GetNoTrans').subscribe((data) => {
      var alertpesan = data.msg;
      if (data.success) {
        var idcekin = data.result;
        if (idcekin == null || idcekin == '' || idcekin == '0' || idcekin == 0) {
          this.storage.set('noso', 0);
        } else {
          this.storage.set('noso', idcekin);
          console.log('noso', idcekin);
        }
        this.getTypeCheckIn();
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
          subTitle: 'Sinkronisasi get Nomor SO gagal.',
          buttons: ['OK']
        });
      alert.present();
    });
  }

  getTypeCheckIn() {
    let body = {
      aksi: 'get_type_checkin',
    };
    this.postPvdr.postData(body, 'TypeCheckin').subscribe((data) => {
      var alertpesan = data.msg;
      if (data.success) {
        this.enable = 1;
        this.storage.set('tipecheckin', data.result);
        // kalo udah sinkron
        this.loader.dismiss();
        this.storage.set('isSync', this.todayDate.substring(0, 10));
        this.isSync = this.todayDate.substring(0, 10);
        document.getElementById('sync').style.display = 'none';
        document.getElementById('sync_done').style.display = '';

        // const alert = this.alertCtrl.create
        //   ({
        //     // title: 'Sukses',
        //     enableBackdropDismiss: false,
        //     subTitle: 'Sinkronisasi berhasil',
        //     buttons: [
        //       {
        //         text: 'ok',
        //         handler: () => {
        //           console.log('Agree clicked');
        //           this.isSync = this.todayDate.substring(0, 10);
        //           document.getElementById('sync').style.display = 'none';
        //           document.getElementById('sync_done').style.display = '';
        //         }
        //       }
        //     ]
        //   });
        // alert.present();

        swal("Berhasil", "Data telah tersinkron", "success")
          .then((value) => {
            // swal(`The returned value is: ${value}`);
            console.log('Ok Clicked');
            this.isSync = this.todayDate.substring(0, 10);
            document.getElementById('sync').style.display = 'none';
            document.getElementById('sync_done').style.display = '';
          });

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
          subTitle: 'Sinkronisasi tipe check in gagal',
          buttons: ['OK']
        });
      alert.present();
    });
  }

  goToKunjungan() {
    this.navCtrl.push(KunjunganPage);
  }

  goToHistoryTransaction() {
    this.navCtrl.push(HistorytransPage);
  }

  goToHistoryCheckIn() {
    this.navCtrl.push(HistorycheckinPage)
  }

  goToProductPage() {
    this.navCtrl.push(ProdukPage)
  }

  goToOutletPage() {
    this.navCtrl.push(OutletPage)
  }



}
