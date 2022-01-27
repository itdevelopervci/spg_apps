import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ToastController, AlertController, LoadingController, ModalController } from 'ionic-angular';
import { Storage } from '@ionic/Storage';
import { PostProvider } from '../../providers/post-provider';
import { SQLite, SQLiteObject } from '@ionic-native/sqlite';
import { HistorytransdetailPage } from '../historytransdetail/historytransdetail';
import { HistorytranspendingdetailPage } from '../historytranspendingdetail/historytranspendingdetail';


@IonicPage()
@Component({
  selector: 'page-historytrans',
  templateUrl: 'historytrans.html',
})
export class HistorytransPage {

  srvr: string = "server";
  loader: any;
  so_pending: any;
  so_sending: any;
  trans_so_list: any;
  trans_so_list_pending: any;

  kdcabang: any;
  kdgudang: any;
  kdsales: any;
  username: any;
  iduser: any;

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    private storage: Storage,
    public toastCtrl: ToastController,
    public alertCtrl: AlertController,
    public postPvdr: PostProvider,
    public loadingCtrl: LoadingController,
    private sqlite: SQLite,
    public modalCtrl: ModalController) {

    this.storage.get('session_user_salesman').then((res) => {
      this.kdcabang = res[0].KdCabang;
      this.kdgudang = res[0].KdGudang;
      this.kdsales = res[0].KdSales;
      this.username = res[0].UserName;
      this.iduser = res[0].Id;
    });

  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad HistorytransPage');
  }

  ionViewDidEnter() {
    this.getPendingTransaction();
    // this.getSendingTransactionLocal();
    if (this.kdsales.length >= 6) {
      this.getDataServerSPG();
    } else {
      this.getDataServer();
    }
  }

  async presentLoading() {
    this.loader = await this.loadingCtrl.create({
      content: "",
      // duration: 2000
    });
    return await this.loader.present();
  }

  getPendingTransaction() {
    this.sqlite.create({
      name: 'vci_mobile.db',
      location: 'default'
    }).then((db: SQLiteObject) => {

      db.executeSql('select * from trans_so where send_status = ? and UserName = ? group by noso', [0, this.username]).then(res => {
        if (res.rows.length > 0) {
          // this.so_pending = res.rows.item(0).NoSO;
          // console.log('so_pending : ', this.so_pending);
          this.trans_so_list_pending = [];
          var tgl_so = "";
          var tgl_so_1 = "";
          var tgl_so_2 = "";
          for (let i = 0; i < res.rows.length; i++) {
            tgl_so_1 = res.rows.item(i).TglSO;
            console.log('tgl_so ', tgl_so);
            if (tgl_so_1 != tgl_so_2) {
              tgl_so = tgl_so_1;
            } else {
              tgl_so = "";
            }
            this.trans_so_list_pending.push({
              'noso': res.rows.item(i).NoSO,
              'tgl_so': tgl_so,
              'nama_outlet': res.rows.item(i).NamaOutlet
            })
            tgl_so_2 = res.rows.item(i).TglSO;
          }
          console.log('pending ', this.trans_so_list_pending);
        }
      }).catch(e => console.log("Failed select table trans_so", e));

      db.executeSql('select * from trans_so where send_status = ? and username = ? group by noso', [0, this.username]).then(res => {
        this.so_pending = res.rows.length;
      }).catch(e => {
        this.so_pending = 0;
        console.log("Failed select table trans_so", e);
      });

    });
  }

  getSendingTransactionLocal() {
    this.sqlite.create({
      name: 'vci_mobile.db',
      location: 'default'
    }).then((db: SQLiteObject) => {

      db.executeSql('select count(NoSO) so_sending from trans_so where send_status = ? group by KdOutlet', [1]).then(res => {
        if (res.rows.length > 0) {
          this.so_sending = res.rows.item(0).so_sending;
          console.log('so_sending : ', this.so_sending);
        }
      }).catch(e => console.log("Failed select table trans_so", e));
    });
  }

  reloadTrans() {
    // this.getDataServer();
    if (this.kdsales.length >= 6) {
      this.getDataServerSPG();
    } else {
      this.getDataServer();
    }
  }

  getDataServer() {
    let body = {
      kdcabang: this.kdcabang,
      kdgudang: this.kdgudang,
      kdsales: this.kdsales,
      username: this.username,
      aksi: 'get_trans',
    };
    this.presentLoading();
    this.postPvdr.postData(body, 'Transaction').subscribe((data) => {
      var alertmsg = data.msg;
      if (data.success) {
        this.loader.dismiss();
        this.trans_so_list = [];
        var tgl = "";
        var tgl_temp1 = "";
        var tgl_temp2 = "";
        for (let i = 0; i < data.result.length; i++) {
          tgl_temp1 = data.result[i].TglSO;
          if (tgl_temp1 != tgl_temp2) {
            tgl = tgl_temp1;
          } else {
            tgl = "";
          }
          this.trans_so_list.push({
            'noso': data.result[i].NoSO,
            'tgl_so': tgl,
            'nama_outlet': data.result[i].NamaOutlet,
            'kdcabang': data.result[i].KdCabang,
            'kdgudang': data.result[i].KdGudang,
            'color_status': data.result[i].color_status
          })
          tgl_temp2 = data.result[i].TglSO;
          console.log(this.trans_so_list);
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
    }
      , error => {
        this.loader.dismiss();
        const confirm = this.alertCtrl.create({
          title: 'Internet terputus',
          message: 'Kamu sedang tidak terhubung dengan internet',
          buttons: [
            {
              text: 'Tutup',
              handler: () => {
                console.log('Disagree clicked');
                this.navCtrl.pop();
              }
            },
            {
              text: 'Muat ulang',
              handler: () => {
                console.log('Agree clicked');
                this.getDataServer();
              }
            }
          ]
        });
        confirm.present();
      }
    );
  }

  getDataServerSPG() {
    let body = {
      kdcabang: this.kdcabang,
      kdgudang: this.kdgudang,
      kdsales: this.kdsales,
      username: this.username,
      aksi: 'get_trans_spg',
    };
    this.presentLoading();
    this.postPvdr.postData(body, 'Transaction').subscribe((data) => {
      var alertmsg = data.msg;
      if (data.success) {
        this.loader.dismiss();
        this.trans_so_list = [];
        var tgl = "";
        var tgl_temp1 = "";
        var tgl_temp2 = "";
        for (let i = 0; i < data.result.length; i++) {
          tgl_temp1 = data.result[i].TglSO;
          if (tgl_temp1 != tgl_temp2) {
            tgl = tgl_temp1;
          } else {
            tgl = "";
          }
          this.trans_so_list.push({
            'noso': data.result[i].NoSO,
            'tgl_so': tgl,
            'nama_outlet': data.result[i].NamaOutlet,
            'kdcabang': data.result[i].KdCabang,
            'kdgudang': data.result[i].KdGudang,
            'color_status': data.result[i].color_status
          })
          tgl_temp2 = data.result[i].TglSO;
          console.log(this.trans_so_list);
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
    }
      , error => {
        this.loader.dismiss();
        const confirm = this.alertCtrl.create({
          title: 'Internet terputus',
          message: 'Kamu sedang tidak terhubung dengan internet',
          buttons: [
            {
              text: 'Tutup',
              handler: () => {
                console.log('Disagree clicked');
                this.navCtrl.pop();
              }
            },
            {
              text: 'Muat ulang',
              handler: () => {
                console.log('Agree clicked');
                this.getDataServerSPG();
              }
            }
          ]
        });
        confirm.present();
      }
    );
  }

  getDataLocal() {

  }

  getTransDetail(noso, outlet, kdcabang, kdgudang) {
    console.log('Nama Outlet ', outlet)
    let trans_detail = this.modalCtrl.create(HistorytransdetailPage, { noso: noso, outlet: outlet, kdcabang: kdcabang, kdgudang: kdgudang });
    trans_detail.present();
  }

  getTransDetailPending(noso, outlet) {
    console.log('NoSO pending ', noso)
    console.log('Nama Outlet ', outlet)
    let trans_detail = this.modalCtrl.create(HistorytranspendingdetailPage, { noso: noso, outlet: outlet });
    trans_detail.present();

    trans_detail.onDidDismiss(data => {
      console.log('Reload data dari modal close ', data);
      if (data.reload) {
        console.log('reload function ready');
        this.getPendingTransaction();
      }
    });
  }

}
