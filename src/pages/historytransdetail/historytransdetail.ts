import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, LoadingController, AlertController, ToastController, ViewController } from 'ionic-angular';
import { PostProvider } from '../../providers/post-provider';
import { Storage } from '@ionic/Storage';

@IonicPage()
@Component({
  selector: 'page-historytransdetail',
  templateUrl: 'historytransdetail.html',
})
export class HistorytransdetailPage {

  noso: any;
  outlet: any;
  loader: any;
  detail_trans: any;

  NoSO: any;
  TglSO: any;
  SysDate: any;
  NettoSO: any;
  KeteranganSO: any;
  status_order: any;

  kdcabang: any;
  kdgudang: any;
  kdsales: any;
  username: any;

  kiriman_kdcabang: any;
  kiriman_kdgudang: any;

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    private storage: Storage,
    public viewCtrl: ViewController,
    public toastCtrl: ToastController,
    public alertCtrl: AlertController,
    public postPvdr: PostProvider,
    public loadingCtrl: LoadingController) {

    this.getCurrentData(navParams.get('noso'), navParams.get('outlet'), navParams.get('kdcabang'), navParams.get('kdgudang'));

    this.storage.get('session_user_salesman').then((res) => {
      this.kdcabang = res[0].KdCabang;
      this.kdgudang = res[0].KdGudang;
      this.kdsales = res[0].KdSales;
      this.username = res[0].UserName;
    });

  }

  async presentLoading() {
    this.loader = await this.loadingCtrl.create({
      content: "",
      // duration: 2000
    });
    return await this.loader.present();
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad HistorytransdetailPage');
  }

  getClose() {
    this.viewCtrl.dismiss();
  }

  getCurrentData(noso, outlet, kdcabang, kdgudang) {
    this.noso = noso;
    this.outlet = outlet;
    this.kiriman_kdcabang = kdcabang;
    this.kiriman_kdgudang = kdgudang;
    console.log(this.noso);
    console.log(this.outlet);
    console.log(this.kiriman_kdcabang);
    console.log(this.kiriman_kdgudang);
    // this.getTransDetails();
    this.storage.get('session_user_salesman').then((res) => {
      this.kdcabang = res[0].KdCabang;
      this.kdgudang = res[0].KdGudang;
      this.kdsales = res[0].KdSales;
      this.username = res[0].UserName;
      if (this.kiriman_kdcabang == '31' || this.kiriman_kdcabang == '32' || this.kiriman_kdcabang == '33') {
        // this.getTransDetails();
        if (this.kdsales.length >= 6) {
          this.getTransDetailsSPG();
        } else {
          this.getTransDetails();
        }
      } else {
        // this.getTransDetailsRegtim();
        if (this.kdsales.length >= 6) {
          this.getTransDetailsRegtimSPG();
        } else {
          this.getTransDetailsRegtim();
        }
      }
    });


  }

  getTransDetails() {
    let body = {
      noso: this.noso,
      aksi: 'get_trans_detail',
    };
    this.presentLoading();
    this.postPvdr.postData(body, 'Transaction').subscribe((data) => {
      var alertmsg = data.msg;
      if (data.success) {
        this.loader.dismiss();
        this.detail_trans = [];
        for (let i = 0; i < data.result.length; i++) {
          this.NoSO = data.result[0].NoSO;
          this.TglSO = data.result[0].TglSO;
          this.SysDate = data.result[0].SysDate;
          this.NettoSO = data.result[0].NettoSO;
          this.KeteranganSO = data.result[0].KeteranganSO;
          this.detail_trans.push({
            'number': [i + 1],
            'NoSO': data.result[i].NoSO,
            'TglSO': data.result[i].TglSO,
            'AddDateSO': data.result[i].AddDateSO,
            'InsertDate': data.result[i].InsertDate,
            // 'SysDate': data.result[i].SysDate,
            'NettoSO': data.result[i].NettoSO,
            'Netto2SO': data.result[i].Netto2SO,
            'KeteranganSO': data.result[i].KeteranganSO,
            'PCode': data.result[i].PCode,
            'NamaBarang': data.result[i].NamaBarang,
            'Qty': data.result[i].Qty,
            'Jenis': data.result[i].Jenis,
            'Jumlah': data.result[i].Jumlah,
            'Netto': data.result[i].Netto,
            'tipe_promo': data.result[i].tipe_promo,
            'AddDate': data.result[i].AddDate,
            'Keterangan': data.result[i].Keterangan
          })
        }
      } else {
        this.loader.dismiss();
        const toast = this.toastCtrl.create({
          message: alertmsg,
          duration: 2000,
          position: 'top'
        });
        toast.present();
      }
    }, error => {
      this.loader.dismiss();
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
              this.getTransDetails();
            }
          }
        ]
      });
      confirm.present();
    });
  }

  getTransDetailsSPG() {
    let body = {
      noso: this.noso,
      aksi: 'get_trans_detail_spg',
    };
    this.presentLoading();
    this.postPvdr.postData(body, 'Transaction').subscribe((data) => {
      var alertmsg = data.msg;
      if (data.success) {
        this.loader.dismiss();
        this.detail_trans = [];
        for (let i = 0; i < data.result.length; i++) {
          this.NoSO = data.result[0].NoSO;
          this.TglSO = data.result[0].TglSO;
          this.SysDate = data.result[0].SysDate;
          this.NettoSO = data.result[0].NettoSO;
          this.KeteranganSO = data.result[0].KeteranganSO;
          this.detail_trans.push({
            'number': [i + 1],
            'NoSO': data.result[i].NoSO,
            'TglSO': data.result[i].TglSO,
            'AddDateSO': data.result[i].AddDateSO,
            'InsertDate': data.result[i].InsertDate,
            // 'SysDate': data.result[i].SysDate,
            'NettoSO': data.result[i].NettoSO,
            'Netto2SO': data.result[i].Netto2SO,
            'KeteranganSO': data.result[i].KeteranganSO,
            'PCode': data.result[i].PCode,
            'NamaBarang': data.result[i].NamaBarang,
            'Qty': data.result[i].Qty,
            'Jenis': data.result[i].Jenis,
            'Jumlah': data.result[i].Jumlah,
            'Netto': data.result[i].Netto,
            'tipe_promo': data.result[i].tipe_promo,
            'AddDate': data.result[i].AddDate,
            'Keterangan': data.result[i].Keterangan
          })
        }
      } else {
        this.loader.dismiss();
        const toast = this.toastCtrl.create({
          message: alertmsg,
          duration: 2000,
          position: 'top'
        });
        toast.present();
      }
    }, error => {
      this.loader.dismiss();
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
              this.getTransDetailsSPG();
            }
          }
        ]
      });
      confirm.present();
    });
  }

  getTransDetailsRegtim() {
    let body = {
      noso: this.noso,
      aksi: 'get_trans_detail',
    };
    this.presentLoading();
    this.postPvdr.postDataRegtim(body, 'Transaction').subscribe((data) => {
      var alertmsg = data.msg;
      if (data.success) {
        this.loader.dismiss();
        this.detail_trans = [];
        for (let i = 0; i < data.result.length; i++) {
          this.NoSO = data.result[0].NoSO;
          this.TglSO = data.result[0].TglSO;
          this.SysDate = data.result[0].SysDate;
          this.NettoSO = data.result[0].NettoSO;
          this.KeteranganSO = data.result[0].KeteranganSO;
          this.detail_trans.push({
            'number': [i + 1],
            'NoSO': data.result[i].NoSO,
            'TglSO': data.result[i].TglSO,
            'AddDateSO': data.result[i].AddDateSO,
            'InsertDate': data.result[i].InsertDate,
            // 'SysDate': data.result[i].SysDate,
            'NettoSO': data.result[i].NettoSO,
            'Netto2SO': data.result[i].Netto2SO,
            'KeteranganSO': data.result[i].KeteranganSO,
            'PCode': data.result[i].PCode,
            'NamaBarang': data.result[i].NamaBarang,
            'Qty': data.result[i].Qty,
            'Jenis': data.result[i].Jenis,
            'Jumlah': data.result[i].Jumlah,
            'Netto': data.result[i].Netto,
            'tipe_promo': data.result[i].tipe_promo,
            'AddDate': data.result[i].AddDate,
            'Keterangan': data.result[i].Keterangan
          })
        }
      } else {
        this.loader.dismiss();
        const toast = this.toastCtrl.create({
          message: alertmsg,
          duration: 2000,
          position: 'top'
        });
        toast.present();
      }
    }, error => {
      this.loader.dismiss();
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
              this.getTransDetails();
            }
          }
        ]
      });
      confirm.present();
    });
  }

  getTransDetailsRegtimSPG() {
    let body = {
      noso: this.noso,
      aksi: 'get_trans_detail_spg',
    };
    this.presentLoading();
    this.postPvdr.postDataRegtim(body, 'Transaction').subscribe((data) => {
      var alertmsg = data.msg;
      if (data.success) {
        this.loader.dismiss();
        this.detail_trans = [];
        for (let i = 0; i < data.result.length; i++) {
          this.NoSO = data.result[0].NoSO;
          this.TglSO = data.result[0].TglSO;
          this.SysDate = data.result[0].SysDate;
          this.NettoSO = data.result[0].NettoSO;
          this.KeteranganSO = data.result[0].KeteranganSO;
          this.detail_trans.push({
            'number': [i + 1],
            'NoSO': data.result[i].NoSO,
            'TglSO': data.result[i].TglSO,
            'AddDateSO': data.result[i].AddDateSO,
            'InsertDate': data.result[i].InsertDate,
            // 'SysDate': data.result[i].SysDate,
            'NettoSO': data.result[i].NettoSO,
            'Netto2SO': data.result[i].Netto2SO,
            'KeteranganSO': data.result[i].KeteranganSO,
            'PCode': data.result[i].PCode,
            'NamaBarang': data.result[i].NamaBarang,
            'Qty': data.result[i].Qty,
            'Jenis': data.result[i].Jenis,
            'Jumlah': data.result[i].Jumlah,
            'Netto': data.result[i].Netto,
            'tipe_promo': data.result[i].tipe_promo,
            'AddDate': data.result[i].AddDate,
            'Keterangan': data.result[i].Keterangan
          })
        }
      } else {
        this.loader.dismiss();
        const toast = this.toastCtrl.create({
          message: alertmsg,
          duration: 2000,
          position: 'top'
        });
        toast.present();
      }
    }, error => {
      this.loader.dismiss();
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
              this.getTransDetails();
            }
          }
        ]
      });
      confirm.present();
    });
  }

  getCheckOrder() {
    let body = {
      noso: this.noso,
      kdcabang: this.kiriman_kdcabang,
      kdgudang: this.kiriman_kdgudang,
      kdsales: this.kdsales,
      aksi: 'get_trans_status',
    };
    this.presentLoading();
    this.postPvdr.postData(body, 'Transaction').subscribe((data) => {
      var alertmsg = data.msg;
      if (data.success) {
        this.loader.dismiss();
        const alert = this.alertCtrl.create
          ({
            title: 'Status Order',
            subTitle: 'No PO ' + data.result[0].NoPO + ' ' + data.result[0].status_order,
            buttons: ['OK']
          });
        alert.present();
        this.loader.dismiss();
      } else {
        this.loader.dismiss();
        const alert = this.alertCtrl.create
          ({
            title: 'Status Order',
            subTitle: alertmsg,
            buttons: ['OK']
          });
        alert.present();
        this.loader.dismiss();
      }
    }, error => {
      this.loader.dismiss();
      const alert = this.alertCtrl.create
        ({
          title: 'Pehatian',
          subTitle: 'Tidak tersambung dengan server cabang/depo.',
          buttons: ['OK']
        });
      alert.present();
    });
  }

  getCheckOrder2() {
    let body = {
      noso: this.noso,
      kdcabang: this.kiriman_kdcabang,
      kdgudang: this.kiriman_kdgudang,
      kdsales: this.kdsales,
      aksi: 'get_trans_status',
    };
    this.presentLoading();
    this.postPvdr.postData(body, 'Transaction').subscribe((data) => {
      var alertmsg = data.msg;
      if (data.success) {
        this.loader.dismiss();
        this.status_order = data.result[0].status_order;
        // const alert = this.alertCtrl.create
        //   ({
        //     title: 'Status Order',
        //     subTitle: 'No PO ' + data.result[0].NoPO + ' ' + data.result[0].status_order,
        //     buttons: ['OK']
        //   });
        // alert.present();
        this.loader.dismiss();
      } else {
        this.loader.dismiss();
        this.status_order = alertmsg;
        // const alert = this.alertCtrl.create
        //   ({
        //     title: 'Status Order',
        //     subTitle: alertmsg,
        //     buttons: ['OK']
        //   });
        // alert.present();
        this.loader.dismiss();
      }
    }, error => {
      this.loader.dismiss();
      const alert = this.alertCtrl.create
        ({
          title: 'Pehatian',
          subTitle: 'Tidak tersambung dengan server cabang/depo.',
          buttons: ['OK']
        });
      alert.present();
    });
  }

}
