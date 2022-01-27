import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ToastController, LoadingController, AlertController } from 'ionic-angular';
import { Storage } from '@ionic/Storage';
import { PostProvider } from '../../providers/post-provider';


@IonicPage()
@Component({
  selector: 'page-menusalesman',
  templateUrl: 'menusalesman.html',
})
export class MenusalesmanPage {

  total_sales: any;
  total_sales2: any;
  target_sales: any;
  sisa_target: any;
  targets: any;
  netto_biasa: any;
  total_visit: any;
  total_order: any;

  kdcabang: any;
  namacabang: any;
  namadepo: any;
  kdsales: any;
  kdgudang: any;
  iduser: any;
  username: any;

  loader: any;

  todayDate: String = new Date().toISOString();

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    private storage: Storage,
    public postPvdr: PostProvider,
    public toastCtrl: ToastController,
    public loadingCtrl: LoadingController,
    public alertCtrl: AlertController

  ) {

    this.storage.get('session_user_salesman').then((res) => {
      this.username = res[0].UserName;
      this.kdcabang = res[0].KdCabang;
      this.namacabang = res[0].NamaCabang;
      this.namadepo = res[0].NamaDepo;
      this.kdgudang = res[0].KdGudang;
      this.kdsales = res[0].KdSales;
      this.iduser = res[0].Id;
      this.getTotalSalesThisMonth();
      // this.getTotalSalesThisMonth2();
      // this.getTargetSales();
    });

    this.todayDate = this.todayDate.substring(0, 10);

    this.target_sales = '0';
    this.total_sales2 = '0';
    this.sisa_target = '0';

  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad MenusalesmanPage');
  }

  async presentLoading() {
    this.loader = this.loadingCtrl.create({
      content: "",
      // duration: 2000
    });
    this.loader.present();
  }


  getRefresh() {
    this.getTotalSalesThisMonth();
    // this.getTotalSalesThisMonth2();
    // this.getTargetSales();
  }

  getTotalSalesThisMonth() {
    let body = {
      username: this.username,
      kdcabang: this.kdcabang,
      kdgudang: this.kdgudang,
      kdsales: this.kdsales,
      aksi: 'total_sales_this_month'
    };
    this.presentLoading();
    this.postPvdr.postData(body, 'TotalSales').subscribe((data) => {
      if (data.success) {
        this.loader.dismiss();
        this.total_sales = data.result[0].Netto_format;
        this.total_visit = data.result[0].total_visit;
        this.total_order = data.result[0].total_order;
        if (this.total_visit == null || this.total_visit == '') {
          this.total_visit = '0';
        }
        // this.getTotalSalesThisMonth2();
      } else {
        this.loader.dismiss();
        this.total_sales = '0';
        this.total_visit = '0';
        this.total_order = '0';
      }
    }, error => {
      this.loader.dismiss();
      this.total_sales = '0';
      this.total_visit = '0';
      this.total_order = '0';
      const confirm = this.alertCtrl.create({
        title: 'Internet terputus',
        message: 'Kamu sedang tidak terhubung dengan internet.',
        buttons: [
          {
            text: 'Tutup',
            handler: () => {
              console.log('Disagree clicked');
            }
          },
          {
            text: 'Muat ulang',
            handler: () => {
              console.log('Agree clicked');
              this.getTotalSalesThisMonth();
              this.getTargetSales();
            }
          }
        ]
      });
      confirm.present();
    });

  }

  getTotalSalesThisMonth2() {
    let body = {
      username: this.username,
      kdcabang: this.kdcabang,
      kdgudang: this.kdgudang,
      kdsales: this.kdsales,
      aksi: 'total_sales_this_month2'
    };
    this.presentLoading();
    this.postPvdr.postData(body, 'TotalSales').subscribe((data) => {
      if (data.success) {
        this.loader.dismiss();
        this.total_sales2 = data.result[0].Netto_format;
        this.netto_biasa = data.result[0].netto_biasa;
        this.sisa_target = this.targets - this.netto_biasa;
      } else {
        this.loader.dismiss();
        this.total_sales2 = '0';
      }
    }, error => {
      this.loader.dismiss();
      this.total_sales2 = '0';
      const confirm = this.alertCtrl.create({
        // title: 'Internet terputus',
        message: 'Gagal memuat total sales cabang/depo.',
        buttons: [
          {
            text: 'Ok',
            handler: () => {
              console.log('Disagree clicked');
            }
          },
          // {
          //   text: 'Muat ulang',
          //   handler: () => {
          //     console.log('Agree clicked');
          //     this.getTotalSalesThisMonth2();
          //   }
          // }
        ]
      });
      confirm.present();
    });

  }

  getTargetSales() {
    let body = {
      username: this.username,
      kdcabang: this.kdcabang,
      kdgudang: this.kdgudang,
      kdsales: this.kdsales,
      aksi: 'target_sales'
    };
    this.presentLoading();
    this.postPvdr.postData(body, 'TotalSales').subscribe((data) => {
      if (data.success) {
        this.loader.dismiss();
        this.target_sales = data.result[0].nilai;
        this.targets = data.result[0].targets;
      } else {
        this.loader.dismiss();
        this.target_sales = '0';
      }
    }, error => {
      this.loader.dismiss();
      this.target_sales = '0';
      const confirm = this.alertCtrl.create({
        // title: 'Gagal memuat tar',
        message: 'Gagal memuat target sales.',
        buttons: [
          {
            text: 'Ok',
            handler: () => {
              console.log('Disagree clicked');
            }
          },
          // {
          //   text: 'Muat ulang',
          //   handler: () => {
          //     console.log('Agree clicked');
          //     this.getTargetSales();
          //   }
          // }
        ]
      });
      confirm.present();
    });

  }

}
