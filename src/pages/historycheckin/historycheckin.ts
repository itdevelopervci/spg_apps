import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ModalController, LoadingController, ToastController, AlertController } from 'ionic-angular';
import { SQLite, SQLiteObject } from '@ionic-native/sqlite';
import { Storage } from '@ionic/Storage';
import { PostProvider } from '../../providers/post-provider';
import { HistorydetailcheckinPage } from '../historydetailcheckin/historydetailcheckin';


@IonicPage()
@Component({
  selector: 'page-historycheckin',
  templateUrl: 'historycheckin.html',
})
export class HistorycheckinPage {

  jml: any;
  jml_send: any;
  list_checkin: any;
  list_checkin_send: any;
  checkin: string = "sending";

  kdcabang: any;
  kdgudang: any;
  kdsales: any;
  username: any;
  iduser: any;

  loader: any;
  checkin_list: any;

  cekin_pending: any;
  cekin_pending_total: any;

  srvr: string = "server";

  constructor(

    public navCtrl: NavController,
    public navParams: NavParams,
    // private sqlite: SQLite,
    private storage: Storage,
    public modalCtrl: ModalController,
    public loadingCtrl: LoadingController,
    public postPvdr: PostProvider,
    public toastCtrl: ToastController,
    public alertCtrl: AlertController,
    private sqlite: SQLite
  ) {

    this.storage.get('session_user_salesman').then((res) => {
      this.kdcabang = res[0].KdCabang;
      this.kdgudang = res[0].KdGudang;
      this.kdsales = res[0].KdSales;
      this.username = res[0].UserName;
      this.iduser = res[0].Id;
      // this.getDataServer();
      if (this.kdsales.length >= 6) {
        this.getDataServerSPG();
      } else {
        this.getDataServer();
      }
    });

  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad HistorycheckinPage');
  }

  ionViewDidEnter() {
    this.getCheckInPending();
  }

  presentLoading() {
    this.loader = this.loadingCtrl.create({
      content: "",
      // duration: 2000
    });
    this.loader.present();
  }

  reloadCheckin() {
    this.getDataServer();
  }

  getDataLocal() {

  }

  getCheckInPending() {
    this.sqlite.create({
      name: 'vci_mobile.db',
      location: 'default'
    }).then((db: SQLiteObject) => {

      db.executeSql('select *,date(waktuin) waktuin from cek_in where send_status = ?', [0]).then(res => {
        if (res.rows.length > 0) {
          console.log('Result ', res);
          this.cekin_pending = [];
          var tgl_in = "";
          var tgl_in_1 = "";
          var tgl_in_2 = "";
          for (let i = 0; i < res.rows.length; i++) {
            tgl_in_1 = res.rows.item(i).waktuin;
            console.log('tgl_in ', tgl_in);
            if (tgl_in_1 != tgl_in_2) {
              tgl_in = tgl_in_1;
            } else {
              tgl_in = "";
            }
            this.cekin_pending.push({
              'IdCekin': res.rows.item(i).IdCekIn,
              'tgl_in': tgl_in,
              'nama_outlet': res.rows.item(i).NamaOutlet
            })
            tgl_in_2 = res.rows.item(i).waktuin;
          }
          console.log('pending ', this.cekin_pending);
        }
      }).catch(e => console.log("Failed select table cek_in", e));

      db.executeSql('select * from cek_in where send_status = ?', [0]).then(res => {
        this.cekin_pending_total = res.rows.length;
        console.log('pending ', this.cekin_pending_total);
      }).catch(e => {
        this.cekin_pending_total = 0;
        console.log('pending ', this.cekin_pending_total);
        console.log("Failed select table cek_in", e);
      });

    });
  }

  getDataServer() {
    let body = {
      kdcabang: this.kdcabang,
      kdgudang: this.kdgudang,
      username: this.username,
      aksi: 'get_checkin_data',
    };
    this.presentLoading();
    this.postPvdr.postData(body, 'Checkin').subscribe((data) => {
      var alertmsg = data.msg;
      if (data.success) {
        this.loader.dismiss().catch();
        this.checkin_list = [];
        var tgl = "";
        var tgl_1 = "";
        var tgl_2 = "";
        for (let i = 0; i < data.result.length; i++) {
          tgl_1 = data.result[i].TglIn;
          if (tgl_1 != tgl_2) {
            tgl = tgl_1;
          } else {
            tgl = "";
          }
          this.checkin_list.push({
            'idcheckin': data.result[i].IdCekIn,
            'waktu_in': tgl,
            'kd_outlet': data.result[i].KdOtlt,
            'nama_outlet': data.result[i].NamaOutlet,
            'on_loc': data.result[i].OnLoc,
            'lat': data.result[i].Latitude,
            'lng': data.result[i].Longitude,
            'waktu_cin': data.result[i].WaktuIn,
            'waktu_cout': data.result[i].WaktuOut,
            'keterangan': data.result[i].keterangan,
            'color_status': data.result[i].color_status,
            'nilai': data.result[i].nilai,
            'trm': data.result[i].Trm
          })
          tgl_2 = data.result[i].TglIn;
        }
      } else {
        this.loader.dismiss().catch();
        const toast = this.toastCtrl.create({
          message: alertmsg,
          duration: 2000,
          position: 'top'
        });
        toast.present();
      }
    }, error => {
      this.loader.dismiss().catch();
      const confirm = this.alertCtrl.create({
        title: 'Internet terputus',
        message: 'Kamu sedang tidak terhubung dengan internet.',
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
    });

  }

  getDataServerSPG() {
    let body = {
      kdcabang: this.kdcabang,
      kdgudang: this.kdgudang,
      username: this.username,
      aksi: 'get_checkin_data_spg',
    };
    this.presentLoading();
    this.postPvdr.postData(body, 'Checkin').subscribe((data) => {
      var alertmsg = data.msg;
      if (data.success) {
        this.loader.dismiss().catch();
        this.checkin_list = [];
        var tgl = "";
        var tgl_1 = "";
        var tgl_2 = "";
        for (let i = 0; i < data.result.length; i++) {
          tgl_1 = data.result[i].TglIn;
          if (tgl_1 != tgl_2) {
            tgl = tgl_1;
          } else {
            tgl = "";
          }
          this.checkin_list.push({
            'idcheckin': data.result[i].IdCekIn,
            'waktu_in': tgl,
            'kd_outlet': data.result[i].KdOtlt,
            'nama_outlet': data.result[i].NamaOutlet,
            'on_loc': data.result[i].OnLoc,
            'lat': data.result[i].Latitude,
            'lng': data.result[i].Longitude,
            'waktu_cin': data.result[i].WaktuIn,
            'waktu_cout': data.result[i].WaktuOut,
            'keterangan': data.result[i].keterangan,
            'color_status': data.result[i].color_status,
            'nilai': data.result[i].nilai,
            'trm': data.result[i].Trm
          })
          tgl_2 = data.result[i].TglIn;
        }
      } else {
        this.loader.dismiss().catch();
        const toast = this.toastCtrl.create({
          message: alertmsg,
          duration: 2000,
          position: 'top'
        });
        toast.present();
      }
    }, error => {
      this.loader.dismiss().catch();
      const confirm = this.alertCtrl.create({
        title: 'Internet terputus',
        message: 'Kamu sedang tidak terhubung dengan internet.',
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
    });

  }

  getDetailCheckIn(idcheckin, kd_outlet, nama_outlet, on_loc, lat, lng, keterangan, waktu_cin, waktu_cout, nilai, trm) {
    this.navCtrl.push(HistorydetailcheckinPage, {
      idcheckin: idcheckin,
      kd_outlet: kd_outlet,
      nama_outlet: nama_outlet,
      on_loc: on_loc,
      lat: lat,
      lng: lng,
      keterangan: keterangan,
      waktu_cin: waktu_cin,
      waktu_cout: waktu_cout,
      nilai: nilai,
      trm: trm
    })
  }



}
