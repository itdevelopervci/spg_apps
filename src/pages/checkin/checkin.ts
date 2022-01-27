import { Component, ViewChild, ElementRef } from '@angular/core';
import { IonicPage, NavController, NavParams, ModalController, AlertController, LoadingController, ToastController, Platform, App } from 'ionic-angular';
import { TambahprodukPage } from '../tambahproduk/tambahproduk';
import { Storage } from '@ionic/Storage';
import { SQLite, SQLiteObject } from '@ionic-native/sqlite';
import { HomePage } from '../home/home';
import { PostProvider } from '../../providers/post-provider';
import { AppVersion } from '@ionic-native/app-version';
// import { LoginPage } from '../login/login';
// import { CupertinoPane } from 'cupertino-pane';

import swal from 'sweetalert';

@IonicPage()
@Component({
  selector: 'page-checkin',
  templateUrl: 'checkin.html',
})
export class CheckinPage {

  @ViewChild('myInput') myInput: ElementRef;

  fakegps: any;

  tipepromo: any;

  tipecheckin: any;
  tipecheckinmodel: any;
  idcheckin: any;
  kdsalesman: any;
  kdoutlet: any;
  nama_outlet: any;
  truelocation: any;
  longitude: any;
  latitude: any;
  waktuin: any;
  waktuout: any;
  kdcabang: any;
  tglcheckin: any;
  sendstatus: any;
  statuscekin: any;
  loader: any;
  note: String = '';

  kdgudang: any;
  kdsales: any;
  iduser: any;
  notice_trans: any;
  noso: any;

  trans_so_disc: any;
  trans_so_det_list: any;
  trans_so_det: any;
  netto_trans_so: any;
  jumlah_trans_so: any;
  trans_so: any;
  checkin_temp: any;

  alertTrans: any;
  transAlert: any;
  kunjunganAlert: any;

  versi: any;

  pick_month_expr: String = new Date().toISOString();

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    public modalCtrl: ModalController,
    private storage: Storage,
    public alertCtrl: AlertController,
    private sqlite: SQLite,
    public loadingCtrl: LoadingController,
    public postPvdr: PostProvider,
    public toastCtrl: ToastController,
    private platform: Platform,
    public app: App,
    private appVersion: AppVersion

  ) {

    this.platform.registerBackButtonAction(() => {
      // Catches the active view
      let nav = this.app.getActiveNavs()[0];
      let activeView = nav.getActive();
      // Checks if can go back before show up the alert
      if (activeView.name === 'AdditionalordersPage') {
        if (nav.canGoBack()) {
          nav.pop();
        } else {
          this.cancelTrans();
        }
      }
    });

    this.platform.ready().then(() => {
      this.appVersion.getVersionNumber().then((res) => {
        this.versi = res;
        console.log(this.versi);
      }, (err) => {
        console.log(err);
      });
    });



    this.tipecheckinmodel = "00";
    this.loadTipeCekin();
    // this.getCurrentData(
    //   navParams.get('idcheckin'),
    //   navParams.get('kdsalesman'),
    //   navParams.get('kdoutlet'),
    //   navParams.get('nama_outlet'),
    //   navParams.get('truelocation'),
    //   navParams.get('longitude'), //AS LAT
    //   navParams.get('latitude'), //AS LNG
    //   navParams.get('waktuin'),
    //   navParams.get('kdcabang'),
    //   navParams.get('tglcheckin'),
    //   navParams.get('sendstatus'),
    // );
    this.getCurrentData();

    this.storage.get('session_user_salesman').then((res) => {
      this.kdcabang = res[0].KdCabang;
      this.kdgudang = res[0].KdGudang;
      this.kdsales = res[0].KdSales;
      this.iduser = res[0].Id;
      console.log('Kode Sales', this.kdsalesman.length)
    });

  }

  resize() {
    this.myInput.nativeElement.style.height = this.myInput.nativeElement.scrollHeight + 'px';
  }

  pickMonth(m) {
    if (m * 1 < 10) {
      m = '0' + m;
    } else {
      m = m;
    }
    return m;
  }

  pickDate(d) {
    if (d * 1 < 10) {
      d = '0' + d;
    } else {
      d = d;
    }
    return d;
  }

  monthNow(m) {
    if (m * 1 < 10) {
      m = '0' + m;
    } else {
      m = m;
    }
    return m;
  }

  dateNow(d) {
    if (d * 1 < 10) {
      d = '0' + d;
    } else {
      d = d;
    }
    return d;
  }

  getCurrentData() {

    this.storage.get("checkin_temp").then((res) => {
      this.idcheckin = res[0].idcheckin;
      this.kdsalesman = res[0].kdsalesman;
      this.kdoutlet = res[0].kdoutlet;
      this.nama_outlet = res[0].nama_outlet;
      this.truelocation = res[0].truelocation;
      this.latitude = res[0].latitude;
      this.longitude = res[0].longitude;
      this.waktuin = res[0].waktuin;
      this.kdcabang = res[0].kdcabang;
      this.tglcheckin = res[0].tglcheckin;
      this.sendstatus = res[0].sendstatus;
      // console.log('idcheckin in on checkin_temp: ', this.idcheckin);
      // console.log('Waktu in on checkin_temp: ', this.waktuin);
      // console.log('nama_outlet in on checkin_temp: ', this.nama_outlet);
    });

    this.storage.get("fakegps").then((res) => {
      this.fakegps = res;
      console.log('fakegps: ', this.fakegps);
    });


  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad CheckinPage');
  }

  ionViewDidEnter() {
    this.select_db();
    this.storage.set('isCheckIn', 1);
  }

  loadTipeCekin() {
    this.storage.get('tipecheckin').then((res) => {
      console.log('tipecheckin: ', res[0].kd_tipe);
      console.log('tipecheckin: ', res[0].nm_tipe);
      this.tipecheckin = [];
      for (let i = 0; i < res.length; i++) {
        this.tipecheckin.push(
          {
            'kd_tipe': res[i].kd_tipe,
            'nm_tipe': res[i].nm_tipe
          }
        )
      }
    });
    this.storage.get('checkin_temp').then((res) => {
      console.log('Nama outlet checkin_temp: ', res[0].nama_outlet);
    });
  }

  selectTypeCheckIn($event) {
    this.statuscekin = $event;
    console.log("status terpilih : ", this.statuscekin);
  }

  addProduct() {
    const modal = this.modalCtrl.create(TambahprodukPage);
    modal.present();

    modal.onDidDismiss(data => {
      console.log('Reload data dari modal close ', data);
      this.select_db();
      // if (data.reload) {
      //   console.log('reload function ready');
      //   this.select_db();
      // }
    });

  }

  select_db() {
    this.sqlite.create({
      name: 'vci_mobile.db',
      location: 'default'
    }).then((db: SQLiteObject) => {
      db.executeSql('SELECT * FROM trans_so_det WHERE send_status = 0 order by AddDate DESC', [])
        .then(res => {
          if (res.rows.length > 0) {
            console.log("Success SELECT table trans_so_det", res)
            this.notice_trans = 't';
            this.trans_so_det_list = [];
            for (let i = 0; i < res.rows.length; i++) {
              this.trans_so_det_list.push({
                noso: res.rows.item(i).NoSO,
                pcode: res.rows.item(i).PCode,
                namabarang: res.rows.item(i).NamaBarang,
                qty: res.rows.item(i).Qty,
                jenis: res.rows.item(i).Jenis,
                namapromo: res.rows.item(i).NamaPromo,
                netto: res.rows.item(i).Netto
              });
              this.noso = res.rows.item(i).NoSO;
              this.tipepromo = res.rows.item(i).TradePromo;
              console.log('noso ', this.noso);
              console.log('TP ', this.tipepromo);

              db.executeSql('select sum(netto) as netto_so, count(netto) as jml_so from trans_so where noso = ? and send_status = 0', [this.noso])
                .then(res => {
                  if (res.rows.length > 0) {
                    console.log("Success SELECT table trans_so_det", this.noso)
                    // for (let i = 0; i < res.rows.length; i++) {
                    // this.netto_so.push({
                    this.netto_trans_so = res.rows.item(0).netto_so;
                    this.jumlah_trans_so = res.rows.item(0).jml_so;
                    // });

                    // }
                  } else {
                    console.log("Failed SELECT table trans_so_det", res)
                  }
                })
                .catch(e => console.log("Failed SELECT table trans_so_det", e));

            }
          } else {
            this.notice_trans = 'y';
            this.trans_so_det_list = [];
          }
        });


    });
  }

  confirmEditItem(noso, pcode) {
    const confirm = this.alertCtrl.create({
      title: 'Edit',
      message: 'Hapus item ini dari transaksi?',
      buttons: [
        {
          text: 'Batal',
          handler: () => {
            console.log('Disagree clicked');
          }
        },
        {
          text: 'Hapus',
          handler: () => {
            console.log('Agree clicked');
            this.delete_data(noso, pcode);
          }
        }
      ]
    });
    confirm.present();
  }

  confirmDeleteItem(noso, pcode) {
    const confirm = this.alertCtrl.create({
      title: 'Hapus',
      message: 'Hapus item ini dari transaksi?',
      buttons: [
        {
          text: 'Batal',
          handler: () => {
            console.log('Disagree clicked');
          }
        },
        {
          text: 'Hapus',
          handler: () => {
            console.log('Agree clicked');
            this.delete_data(noso, pcode);
          }
        }
      ]
    });
    confirm.present();
  }

  delete_data(noso, pcode) {
    this.sqlite.create({
      name: 'vci_mobile.db',
      location: 'default'
    }).then((db: SQLiteObject) => {
      // det
      db.executeSql('DELETE FROM trans_so_det WHERE NoSO = ? AND PCode = ?', [noso, pcode])
        .then(res => {
          console.log("Success Delete table trans_so_det", res);

          this.sqlite.create({
            name: 'vci_mobile.db',
            location: 'default'
          }).then((db: SQLiteObject) => {

            // disc
            db.executeSql('DELETE FROM trans_so_disc WHERE NoSO = ? AND PCode = ?', [noso, pcode])
              .then(res => {
                console.log("Success Delete table trans_so_disc", res);

                this.sqlite.create({
                  name: 'vci_mobile.db',
                  location: 'default'
                }).then((db: SQLiteObject) => {

                  // hd
                  db.executeSql('DELETE FROM trans_so WHERE NoSO = ? AND PCode = ?', [noso, pcode])
                    .then(res => {
                      console.log("Success Delete table trans_so", res);
                      this.select_db();
                    })
                    .catch(e => console.log("Failed DELETE table trans_so", e));
                });

              })
              .catch(e => console.log("Failed DELETE table trans_so_disc", e));
          });

        })
        .catch(e => console.log("Failed DELETE table trans_so_det", e));
    });
  }

  async presentLoading() {
    this.loader = await this.loadingCtrl.create({
      content: "",
      // duration: 2000
    });
    return await this.loader.present();
  }

  getCheckoutSendTransaction() {
    if (this.tipecheckinmodel == '00') {
      // alert('Pilih status check in terlebih dahulu.');
      const alert = this.alertCtrl.create({
        title: 'Perhatian',
        subTitle: 'Pilih status check in terlebih dahulu',
        buttons: ['OK']
      });
      alert.present();
    } else {
      if (this.notice_trans == 't') {

        this.pick_month_expr = this.pick_month_expr.substring(0, 10);
        this.sqlite.create({
          name: 'vci_mobile.db',
          location: 'default'
        }).then((db: SQLiteObject) => {
          db.executeSql('UPDATE trans_so SET TglExp = ?, Keterangan = ? WHERE NoSO = ? ', [this.pick_month_expr, this.note, this.noso])
            .then(res => {
              console.log("Success UPDATE table trans_so", res);
            })
            .catch(e => {
              console.log("Failed UPDATE table trans_so", e);
              this.notice_trans = 'y';
            });
        });

        // select trans_so_disc
        this.sqlite.create({
          name: 'vci_mobile.db',
          location: 'default'
        }).then((db: SQLiteObject) => {
          db.executeSql('SELECT * FROM trans_so_disc WHERE send_status = ? AND NoSO = ? AND Nilai != 0', [0, this.noso])
            .then(res => {
              console.log("Success SELECT table trans_so_disc noso " + this.noso + " ", res)
              this.trans_so_disc = [];
              for (let i = 0; i < res.rows.length; i++) {
                this.trans_so_disc.push({
                  noso: res.rows.item(i).NoSO,
                  pcode: res.rows.item(i).PCode,
                  persendisc1: res.rows.item(i).PersenDisc1,
                  nilaiawal: res.rows.item(i).NilaiAwal,
                  rpdisc: res.rows.item(i).RpDisc,
                  nilai: res.rows.item(i).Nilai,
                  persendiscall: res.rows.item(i).PersenDiscAll,
                  adddate: res.rows.item(i).AddDate,
                  editdate: res.rows.item(i).EditDate,
                  kdgudang: res.rows.item(i).KdGudang,
                  kdcabang: res.rows.item(i).KdCabang
                });
              }
              console.log('Trans SO Disc Data ', this.trans_so_disc);
            })
            .catch(e => console.log("Failed SELECT table trans_so_disc", e));
        });

        // select trans_so_det
        this.sqlite.create({
          name: 'vci_mobile.db',
          location: 'default'
        }).then((db: SQLiteObject) => {
          db.executeSql('SELECT * FROM trans_so_det WHERE send_status = ? AND NoSO = ? AND Qty != 0 AND Netto NOT NULL', [0, this.noso])
            .then(res => {
              console.log("Success SELECT table trans_so_det noso " + this.noso + " ", res);
              this.trans_so_det = [];
              for (let i = 0; i < res.rows.length; i++) {
                this.trans_so_det.push({
                  noso: res.rows.item(i).NoSO,
                  pcode: res.rows.item(i).PCode,
                  qty: res.rows.item(i).Qty,
                  jenis: res.rows.item(i).Jenis,
                  jumlah: res.rows.item(i).Jumlah,
                  netto: res.rows.item(i).Netto,
                  tradepromo: res.rows.item(i).TradePromo,
                  keterangan: res.rows.item(i).Keterangan,
                  adddate: res.rows.item(i).AddDate,
                  editdate: res.rows.item(i).Editdate,
                  kdgudang: res.rows.item(i).KdGudang,
                  kdcabang: res.rows.item(i).KdCabang
                });
              }
              console.log('Trans SO Detail Data ', this.trans_so_det);
            })
            .catch(e => console.log("Failed SELECT table trans_so_det", e));
        });

        // select trans_so
        this.sqlite.create({
          name: 'vci_mobile.db',
          location: 'default'
        }).then((db: SQLiteObject) => {
          db.executeSql('SELECT \
                      NoSO, \
                      TglSO, \
                      KdSales, \
                      KdOutlet, \
                      TglPO, \
                      TglExp, \
                      UserName, \
                      PCode, \
                      SUM(Netto) AS Netto, \
                      SUM(Netto2) AS Netto2, \
                      PersenDisc, \
                      SUM(RpDisc) AS RpDisc, \
                      SUM(Bruto) AS Bruto, \
                      PPN, \
                      JBayar, \
                      Trm, \
                      Keterangan, \
                      AddDate, \
                      EditDate, \
                      KdGudang, \
                      Status_Kirim, \
                      InsertDate, \
                      KdCabang, \
                      KdDevice \
                      FROM trans_so WHERE send_status = 0 AND NoSO = ? GROUP BY NoSO ORDER BY AddDate', [this.noso])
            .then(res => {
              console.log("Success SELECT table trans_so noso " + this.noso + " ", res);
              this.trans_so = [];
              for (let i = 0; i < res.rows.length; i++) {
                this.trans_so.push({
                  noso: res.rows.item(i).NoSO,
                  tglso: res.rows.item(i).TglSO,
                  kdsales: res.rows.item(i).KdSales,
                  kdoutlet: res.rows.item(i).KdOutlet,
                  tglpo: res.rows.item(i).TglPO,
                  tglexp: res.rows.item(i).TglExp,
                  username: res.rows.item(i).UserName,
                  netto: res.rows.item(i).Netto,
                  netto2: res.rows.item(i).Netto2,
                  persendisc: res.rows.item(i).PersenDisc,
                  rpdisc: res.rows.item(i).RpDisc,
                  bruto: res.rows.item(i).Bruto,
                  ppn: res.rows.item(i).PPN,
                  jbayar: res.rows.item(i).JBayar,
                  trm: res.rows.item(i).Trm,
                  keterangan: res.rows.item(i).Keterangan,
                  adddate: res.rows.item(i).AddDate,
                  editdate: res.rows.item(i).EditDate,
                  kdgudang: res.rows.item(i).KdGudang,
                  statuskirim: res.rows.item(i).Status_Kirim,
                  insertdate: res.rows.item(i).InsertDate,
                  kdcabang: res.rows.item(i).KdCabang,
                  kddevice: res.rows.item(i).KdDevice
                });
              }
              console.log('Trans SO Data ', this.trans_so);
            })
            .catch(e => console.log("Failed SELECT table trans_so", e));
        });

      }

      const confirm = this.alertCtrl.create({
        title: 'Perhatian',
        message: 'Check out dan kirim transaksi?',
        buttons: [
          {
            text: 'Batal',
            handler: () => {
              console.log('Disagree clicked');
            }
          },
          {
            text: 'Kirim',
            handler: () => {
              console.log('Agree clicked');
              this.sendDataCheckInOutlet();
            }
          }
        ]
      });
      confirm.present();

    }

  }

  sendDataCheckInOutlet() {
    var today = new Date();
    var date = today.getFullYear() + '-' + this.pickMonth((today.getMonth() + 1)) + '-' + this.pickDate(today.getDate());
    var myTime: String = new Date(today.getTime() - today.getTimezoneOffset() * 60000).toISOString();

    this.waktuout = date + ' ' + myTime.substring(11, 19);
    console.log('waktu out: ', this.waktuout);
    // send to server
    let body = {
      idcheckin: String(this.idcheckin),
      kdsalesman: this.kdsalesman,
      kdoutlet: this.kdoutlet,
      truelocation: this.truelocation,
      latitude: this.latitude,
      longitude: this.longitude,
      waktuin: this.waktuin,
      waktuout: this.waktuout,
      kdcabang: this.kdcabang,
      statuscekin: this.statuscekin,
      fakegps: this.fakegps,
      versi: this.versi,
      aksi: 'send_data_checkin'
    };
    this.presentLoading();
    this.postPvdr.postData(body, 'SendCheckIn').subscribe((data) => {
      // save to local sqlite
      this.sqlite.create({
        name: 'vci_mobile.db',
        location: 'default'
      }).then((db: SQLiteObject) => {
        db.executeSql('INSERT INTO cek_in (IdCekIn,KdSalesman,KdOutlet,NamaOutlet,TrueLocation,Latitude,Longitude,WaktuIn,WaktuOut,KdCabang,statuscekin,TglCheckIn,send_status) \
          VALUES(?,?,?,?,?,?,?,?,?,?,?,?,?)',
          [
            this.idcheckin,
            this.kdsalesman,
            this.kdoutlet,
            this.nama_outlet,
            this.truelocation,
            this.latitude,
            this.longitude,
            this.waktuin,
            this.waktuout,
            this.kdcabang,
            this.statuscekin,
            this.tglcheckin,
            this.sendstatus
          ])
          .then(res => {
            console.log("Success insert table cek_in", res);
          })
          .catch(e => console.log("Failed insert table cek_in", e));
      });

      var alertpesan = data.msg;
      if (data.success) {
        this.loader.dismiss();

        this.getIdCheckinSPG();


        // this.getIdCheckin();
        if (this.kdsalesman.length >= 6) {
          this.getIdCheckinSPG();
        } else {
          this.getIdCheckin();
        }

        if (this.notice_trans == 't') {
          this.sentTransaction();
        } else {
          swal("Terkirim", "Data telah terkirim", "success")
            .then((value) => {
              // swal(`The returned value is: ${value}`);
              console.log('Ok Clicked');
              this.storage.remove('outlet_temp');
              this.storage.remove('isCheckIn');
              this.navCtrl.setRoot(HomePage);
            });
        }

        // kalo udah ke kirim
        this.kunjunganAlert = 1;

        // const alert = this.alertCtrl.create
        //   ({
        //     enableBackdropDismiss: false,
        //     title: 'DATA TERKIRIM',
        //     subTitle: 'KUNJUNGAN DI OUTLET ' + this.nama_outlet + ' BERHASIL TERKIRIM.',
        //     buttons: [
        //       {
        //         text: 'Ok',
        //         handler: () => {
        //           this.storage.remove('outlet_temp');
        //           this.storage.remove('isCheckIn');
        //           this.navCtrl.setRoot(HomePage);
        //         }
        //       }
        //     ]
        //   });
        // alert.present();

        // const toast = this.toastCtrl.create({
        //   message: 'KUNJUNGAN DI OUTLET ' + this.nama_outlet + ' BERHASIL TERKIRIM.',
        //   showCloseButton: true,
        //   closeButtonText: 'Ok'
        // });
        // toast.onDidDismiss(() => {
        //   this.storage.remove('outlet_temp');
        //   this.storage.remove('isCheckIn');
        //   this.navCtrl.setRoot(HomePage);
        // });
        // toast.present();


        // this.showMenuPane();


        // Update status jadi 1 kalo ke kirim
        this.sqlite.create({
          name: 'vci_mobile.db',
          location: 'default'
        }).then((db: SQLiteObject) => {
          db.executeSql('UPDATE cek_in SET send_status = 1 WHERE IdCekIn = ?', [this.idcheckin])
            .then(res => {
              console.log("Success update table cek_in where transaction number", this.idcheckin);
            })
            .catch(e => console.log("Failed update table cek_in", e));
        });

      } else {
        // Update status jadi 0 kalo ga ke kirim
        this.sqlite.create({
          name: 'vci_mobile.db',
          location: 'default'
        }).then((db: SQLiteObject) => {
          db.executeSql('INSERT INTO cek_in (IdCekIn,KdSalesman,KdOutlet,NamaOutlet,TrueLocation,Latitude,Longitude,WaktuIn,WaktuOut,KdCabang,statuscekin,TglCheckIn,send_status) \
            VALUES(?,?,?,?,?,?,?,?,?,?,?,?,?)',
            [
              this.idcheckin,
              this.kdsalesman,
              this.kdoutlet,
              this.nama_outlet,
              this.truelocation,
              this.latitude,
              this.longitude,
              this.waktuin,
              this.waktuout,
              this.kdcabang,
              this.statuscekin,
              this.tglcheckin,
              0
            ])
            .then(res => {
              console.log("Success insert table cek_in pending", res);
            })
            .catch(e => console.log("Failed insert table cek_in", e));
        });

        this.getIdCheckinSPG();


        // this.getIdCheckin();
        if (this.kdsalesman.length >= 6) {
          this.getIdCheckinSPG();
        } else {
          this.getIdCheckin();
        }

        this.loader.dismiss();
        const alert = this.alertCtrl.create
          ({
            enableBackdropDismiss: false,
            title: 'Kunjungan ' + alertpesan,
            subTitle: 'Kunjungan di outlet ' + this.nama_outlet + ' gagal.',
            buttons: [
              {
                text: 'Ok',
                handler: () => {
                  this.storage.remove('outlet_temp');
                  this.storage.remove('isCheckIn');
                  this.navCtrl.setRoot(HomePage);
                }
              }
            ]
          });
        alert.present();
      }
    }, error => {
      // Update status jadi 0 kalo ga ke kirim
      this.sqlite.create({
        name: 'vci_mobile.db',
        location: 'default'
      }).then((db: SQLiteObject) => {
        db.executeSql('INSERT INTO cek_in (IdCekIn,KdSalesman,KdOutlet,NamaOutlet,TrueLocation,Latitude,Longitude,WaktuIn,WaktuOut,KdCabang,statuscekin,TglCheckIn,send_status) \
          VALUES(?,?,?,?,?,?,?,?,?,?,?,?,?)',
          [
            this.idcheckin,
            this.kdsalesman,
            this.kdoutlet,
            this.nama_outlet,
            this.truelocation,
            this.latitude,
            this.longitude,
            this.waktuin,
            this.waktuout,
            this.kdcabang,
            this.statuscekin,
            this.tglcheckin,
            0
          ])
          .then(res => {
            console.log("Success insert table cek_in pending", res);
          })
          .catch(e => console.log("Failed insert table cek_in", e));
      });

      this.getIdCheckinSPG();


      if (this.kdsalesman.length >= 6) {
        this.getIdCheckinSPG();
      } else {
        this.getIdCheckin();
      }

      this.loader.dismiss();
      const alert = this.alertCtrl.create
        ({
          title: 'Perhatian',
          subTitle: 'Tidak tersabung dengan jaringan internet, cek kembali signal atau kuota internet anda! [CI]',
          buttons: [
            {
              text: 'Ok',
              handler: () => {
                this.storage.remove('outlet_temp');
                this.storage.remove('isCheckIn');
                this.navCtrl.setRoot(HomePage);
                // this.storage.clear();
                // this.navCtrl.setRoot(LoginPage); 
              }
            }
          ]
        });
      alert.present();
    });

  }

  getIdCheckin() {
    let body = {
      kdsales: this.kdsales,
      kdcabang: this.kdcabang,
      aksi: 'get_idcheckin',
    };
    this.postPvdr.postData(body, 'GetNoTrans').subscribe((data) => {
      if (data.success) {
        console.log("idcheckin", data.result)
        // this.storage.set('idcheckin', data.result);

        this.sqlite.create({
          name: 'vci_mobile.db',
          location: 'default'
        }).then((db: SQLiteObject) => {

          db.executeSql('select max(IdCekIn) as IdCekIn from cek_in', [])
            .then(res => {
              if (res.rows.length > 0) {
                console.log("Success SELECT table max(IdCekIn)", res.rows.item(0).IdCekIn)
                console.log("max(IdCekIn) parseInt", parseInt(res.rows.item(0).IdCekIn))

                var idcheckin_ = [
                  {
                    idcheckin: parseInt(res.rows.item(0).IdCekIn),
                  }
                ];

                this.storage.set('idcheckin', idcheckin_);

              } else {
                console.log("Failed SELECT table max(IdCekIn)", res)
              }
            })
            .catch(e => console.log("Failed SELECT table max(IdCekIn)", e));
        });

      } else {
        this.loader.dismiss();
        const toast = this.toastCtrl.create({
          message: 'Gagal Mengambil ID Check In',
          duration: 2000,
          position: 'top'
        });
        toast.present();
      }
    }, error => {

      // this.sqlite.create({
      //   name: 'vci_mobile.db',
      //   location: 'default'
      // }).then((db: SQLiteObject) => {

      //   db.executeSql('select max(IdCekIn) as IdCekIn from cek_in', [])
      //     .then(res => {
      //       if (res.rows.length > 0) {
      //         console.log("Success SELECT table max(IdCekIn)", res.rows.item(0).IdCekIn)
      //         this.storage.set('idcheckin', res.rows.item(0).IdCekIn);
      //       } else {
      //         console.log("Failed SELECT table max(IdCekIn)", res)
      //       }
      //     })
      //     .catch(e => console.log("Failed SELECT table max(IdCekIn)", e));
      // });

      const alert = this.alertCtrl.create
        ({
          title: 'Pehatian',
          subTitle: 'Sinkronisasi get id check in gagal.',
          buttons: ['OK']
        });
      alert.present();
    });
  }

  getIdCheckinSPG() {
    let body = {
      kdsales: this.kdsales,
      kdcabang: this.kdcabang,
      aksi: 'get_idcheckin_spg',
    };
    this.postPvdr.postData(body, 'GetNoTrans').subscribe((data) => {
      if (data.success) {
        console.log("idcheckin", data.result)
        // this.storage.set('idcheckin', data.result);

        this.sqlite.create({
          name: 'vci_mobile.db',
          location: 'default'
        }).then((db: SQLiteObject) => {

          db.executeSql('select max(IdCekIn) as IdCekIn from cek_in', [])
            .then(res => {
              if (res.rows.length > 0) {
                console.log("Success SELECT table max(IdCekIn)", res.rows.item(0).IdCekIn)
                console.log("max(IdCekIn) parseInt", parseInt(res.rows.item(0).IdCekIn))

                var idcheckin_ = [
                  {
                    idcheckin: parseInt(res.rows.item(0).IdCekIn),
                  }
                ];

                this.storage.set('idcheckin', idcheckin_);

              } else {
                console.log("Failed SELECT table max(IdCekIn)", res)
              }
            })
            .catch(e => console.log("Failed SELECT table max(IdCekIn)", e));
        });

      } else {
        this.loader.dismiss();
        const toast = this.toastCtrl.create({
          message: 'Gagal Mengambil ID Check In',
          duration: 2000,
          position: 'top'
        });
        toast.present();
      }
    }, error => {

      // this.sqlite.create({
      //   name: 'vci_mobile.db',
      //   location: 'default'
      // }).then((db: SQLiteObject) => {

      //   db.executeSql('select max(IdCekIn) as IdCekIn from cek_in', [])
      //     .then(res => {
      //       if (res.rows.length > 0) {
      //         console.log("Success SELECT table max(IdCekIn)", res.rows.item(0).IdCekIn)
      //         this.storage.set('idcheckin', res.rows.item(0).IdCekIn);
      //       } else {
      //         console.log("Failed SELECT table max(IdCekIn)", res)
      //       }
      //     })
      //     .catch(e => console.log("Failed SELECT table max(IdCekIn)", e));
      // });

      const alert = this.alertCtrl.create
        ({
          title: 'Pehatian',
          subTitle: 'Sinkronisasi get id check in gagal.',
          buttons: ['OK']
        });
      alert.present();
    });
  }

  // Sending Transaction
  sentTransaction() {
    if (this.kdsalesman.length >= 6) {
      this.selectTransactionDiscSPG();
      // alert('SPG');
    } else {
      // alert('SALESMAN');
      this.selectTransactionDisc();
    }
  }

  selectTransactionDiscSPG() {
    let body = {
      trans_so_disc: this.trans_so_disc,
      aksi: 'send_trans_so_disc_spg'
    };
    this.presentLoading();
    this.postPvdr.postData(body, 'Transaction').subscribe((data) => {
      if (data.success) {
        // send trans_so_det
        this.selectTransactionDetSPG();
        // update status
        this.sqlite.create({
          name: 'vci_mobile.db',
          location: 'default'
        }).then((db: SQLiteObject) => {
          db.executeSql('UPDATE trans_so_disc SET send_status = 1 WHERE NoSO = ?', [this.noso])
            .then(res => {
              console.log("Success update table trans_so_disc_in where transaction number", this.noso);
            })
            .catch(e => console.log("Failed update table trans_so_disc", e));
        });

      } else {
        this.loader.dismiss();
        const toast = this.toastCtrl.create({
          message: 'Transaksi Detail Tidak Terkirim',
          duration: 2000,
          position: 'top'
        });
        toast.present();
      }
    }, error => {
      this.loader.dismiss();
      this.deleteDisc();
      const alert = this.alertCtrl.create
        ({
          title: 'Pehatian',
          subTitle: 'Tidak tersabung dengan Internet, cek kembali signal atau kuota internet anda. [Disc]',
          // buttons: ['OK']
          buttons: [
            {
              text: 'Kirim Ulang',
              handler: () => {
                this.sentTransaction();
              }
            },
            {
              text: 'Ok',
              handler: () => {
                // code here
              }
            }
          ]
        });
      alert.present();
    });
  }

  deleteDisc() {
    let body = {
      noso: this.noso,
      aksi: 'delete_trans_so_disc_spg'
    };
    this.presentLoading();
    this.postPvdr.postData(body, 'Transaction').subscribe((data) => {
      if (data.success) {
        this.loader.dismiss();
        this.selectTransactionDiscSPG();
      } else {
        this.loader.dismiss();
        const toast = this.toastCtrl.create({
          message: 'No Transaksi Tidak Valid',
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
          subTitle: 'Tidak tersabung dengan Internet, cek kembali signal atau kuota internet anda. [DelDisc]',
          buttons: [
            {
              text: 'Coba lagi',
              handler: () => {
                this.deleteDisc();
              }
            },
            {
              text: 'Ok',
              handler: () => { }
            }
          ]
        });
      alert.present();
    });
  }

  selectTransactionDetSPG() {
    let body = {
      trans_so_det: this.trans_so_det,
      aksi: 'send_trans_so_det_spg'
    };
    this.postPvdr.postData(body, 'Transaction').subscribe((data) => {
      if (data.success) {
        // send trans_so
        this.selectTransactionHeaderSPG();
        // update status 1
        this.sqlite.create({
          name: 'vci_mobile.db',
          location: 'default'
        }).then((db: SQLiteObject) => {
          db.executeSql('UPDATE trans_so_det SET send_status = 1 WHERE NoSO = ?', [this.noso])
            .then(res => {
              console.log("Success update table trans_so_det_in where transaction number", this.noso);
            })
            .catch(e => console.log("Failed update table trans_so_det", e));
        });

      } else {
        this.loader.dismiss();
        const toast = this.toastCtrl.create({
          message: 'Transaksi Detail Tidak Terkirim',
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
          subTitle: 'Tidak tersabung dengan Internet, cek kembali signal atau kuota internet anda.[Det]',
          buttons: ['OK']
        });
      alert.present();
    });
  }

  selectTransactionHeaderSPG() {
    let body = {
      trans_so: this.trans_so,
      aksi: 'send_trans_so_spg'
    };
    this.postPvdr.postData(body, 'Transaction').subscribe((data) => {
      if (data.success) {
        // send trans_so_number
        this.getNoSoSPG();
        // update status
        this.sqlite.create({
          name: 'vci_mobile.db',
          location: 'default'
        }).then((db: SQLiteObject) => {
          db.executeSql('UPDATE trans_so SET send_status = 1 WHERE NoSO = ?', [this.noso])
            .then(res => {
              console.log("Success update table trans_so_in where transaction number", this.noso);
            })
            .catch(e => console.log("Failed update table trans_so", e));
        });
      } else {
        this.loader.dismiss();
        const toast = this.toastCtrl.create({
          message: 'Transaksi Header Tidak Terkirim',
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
          subTitle: 'Tidak tersabung dengan Internet, cek kembali signal atau kuota internet anda.[So]',
          buttons: ['OK']
        });
      alert.present();
    });
  }

  getNoSoSPG() {
    let body = {
      kdsales: this.kdsales,
      kdcabang: this.kdcabang,
      aksi: 'get_noso_spg',
    };
    this.postPvdr.postData(body, 'GetNoTrans').subscribe((data) => {
      if (data.success) {
        var noso_online = data.result;
        if (noso_online == null || noso_online == '' || noso_online == '0' || noso_online == 0) {
          this.storage.set('noso', 0);
        } else {
          this.storage.set('noso', noso_online);
          console.log('noso', noso_online);
        }
        this.loader.dismiss();

        this.transAlert = 1;

        swal("Terkirim", "Data telah terkirim", "success")
          .then((value) => {
            console.log('Ok Clicked');
            this.storage.remove('outlet_temp');
            this.storage.remove('isCheckIn');
            this.navCtrl.setRoot(HomePage);
            // this.deleteTableTransSO();
          });

      } else {
        this.loader.dismiss();
        const toast = this.toastCtrl.create({
          message: 'Transaksi Gagal Terkirim',
          duration: 2000,
          position: 'top'
        });
        toast.present();
      }
    }, error => {
      const alert = this.alertCtrl.create
        ({
          title: 'Pehatian',
          subTitle: 'Tidak tersabung dengan Internet, cek kembali signal atau kuota internet anda',
          buttons: ['OK']
        });
      alert.present();
    });

  }

  selectTransactionDisc() {
    let body = {
      trans_so_disc: this.trans_so_disc,
      aksi: 'send_trans_so_disc'
    };
    this.presentLoading();
    this.postPvdr.postData(body, 'Transaction').subscribe((data) => {
      if (data.success) {
        // send trans_so_det
        this.selectTransactionDet();
        // update status
        this.sqlite.create({
          name: 'vci_mobile.db',
          location: 'default'
        }).then((db: SQLiteObject) => {
          db.executeSql('UPDATE trans_so_disc SET send_status = 1 WHERE NoSO = ?', [this.noso])
            .then(res => {
              console.log("Success update table trans_so_disc_in where transaction number", this.noso);
            })
            .catch(e => console.log("Failed update table trans_so_disc", e));
        });

      } else {
        this.loader.dismiss();
        const toast = this.toastCtrl.create({
          message: 'Transaksi Detail Tidak Terkirim',
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
          subTitle: 'Tidak tersabung dengan Internet, cek kembali signal atau kuota internet anda. [Disc]',
          // buttons: ['OK']
          buttons: [
            {
              text: 'Kirim Ulang',
              handler: () => {
                this.sentTransaction();
              }
            },
            {
              text: 'Ok',
              handler: () => {
                // code here
              }
            }
          ]
        });
      alert.present();
    });
  }

  selectTransactionDet() {
    let body = {
      trans_so_det: this.trans_so_det,
      aksi: 'send_trans_so_det'
    };
    this.postPvdr.postData(body, 'Transaction').subscribe((data) => {
      if (data.success) {
        // send trans_so
        this.selectTransactionHeader();
        // update status 1
        this.sqlite.create({
          name: 'vci_mobile.db',
          location: 'default'
        }).then((db: SQLiteObject) => {
          db.executeSql('UPDATE trans_so_det SET send_status = 1 WHERE NoSO = ?', [this.noso])
            .then(res => {
              console.log("Success update table trans_so_det_in where transaction number", this.noso);
            })
            .catch(e => console.log("Failed update table trans_so_det", e));
        });

      } else {
        this.loader.dismiss();
        const toast = this.toastCtrl.create({
          message: 'Transaksi Detail Tidak Terkirim',
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
          subTitle: 'Tidak tersabung dengan Internet, cek kembali signal atau kuota internet anda.[Det]',
          buttons: ['OK']
        });
      alert.present();
    });
  }

  selectTransactionHeader() {
    let body = {
      trans_so: this.trans_so,
      aksi: 'send_trans_so'
    };
    this.postPvdr.postData(body, 'Transaction').subscribe((data) => {
      if (data.success) {
        // send trans_so_number
        this.getNoSo();
        // update status
        this.sqlite.create({
          name: 'vci_mobile.db',
          location: 'default'
        }).then((db: SQLiteObject) => {
          db.executeSql('UPDATE trans_so SET send_status = 1 WHERE NoSO = ?', [this.noso])
            .then(res => {
              console.log("Success update table trans_so_in where transaction number", this.noso);
            })
            .catch(e => console.log("Failed update table trans_so", e));
        });
      } else {
        this.loader.dismiss();
        const toast = this.toastCtrl.create({
          message: 'Transaksi Header Tidak Terkirim',
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
          subTitle: 'Tidak tersabung dengan Internet, cek kembali signal atau kuota internet anda.[So]',
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
      if (data.success) {
        var noso_online = data.result;
        if (noso_online == null || noso_online == '' || noso_online == '0' || noso_online == 0) {
          this.storage.set('noso', 0);
        } else {
          this.storage.set('noso', noso_online);
          console.log('noso', noso_online);
        }
        this.loader.dismiss();

        this.transAlert = 1;

        // const alert = this.alertCtrl.create
        //   ({
        //     enableBackdropDismiss: false,
        //     title: 'DATA TERKIRIM',
        //     subTitle: 'PROSES TRANSAKSI DI TOKO ' + this.nama_outlet + ' BERHASIL TERKIRIM.',
        //     buttons: [
        //       {
        //         text: 'Ok',
        //         handler: () => {
        //           // this.storage.remove('outlet_temp');
        //           // this.storage.remove('isCheckIn');
        //           // this.navCtrl.setRoot(HomePage);
        //         }
        //       }
        //     ]
        //   });
        // alert.present();

        swal("Terkirim", "Data telah terkirim", "success")
          .then((value) => {
            // swal(`The returned value is: ${value}`);
            console.log('Ok Clicked');
            this.storage.remove('outlet_temp');
            this.storage.remove('isCheckIn');
            this.navCtrl.setRoot(HomePage);
          });

        // const toast = this.toastCtrl.create({
        //   message: 'PROSES TRANSAKSI DI TOKO ' + this.nama_outlet + ' BERHASIL TERKIRIM.',
        //   showCloseButton: true,
        //   closeButtonText: 'Ok'
        // });
        // toast.onDidDismiss(() => {
        //   this.storage.remove('outlet_temp');
        //   this.storage.remove('isCheckIn');
        //   // this.navCtrl.setRoot(HomePage);
        // });
        // toast.present();

        // this.showMenuPane();

      } else {
        this.loader.dismiss();
        const toast = this.toastCtrl.create({
          message: 'Transaksi Gagal Terkirim',
          duration: 2000,
          position: 'top'
        });
        toast.present();
      }
    }, error => {
      const alert = this.alertCtrl.create
        ({
          title: 'Pehatian',
          subTitle: 'Tidak tersabung dengan Internet, cek kembali signal atau kuota internet anda',
          buttons: ['OK']
        });
      alert.present();
    });

  }


  // Cancel transaction
  cancelTrans() {
    let alert = this.alertCtrl.create({
      title: 'Batal Kunjungan',
      message: 'Batalkan kunjungan di outlet ini?',
      buttons: [
        {
          text: 'Ya',
          handler: () => {
            this.deleteTableTransSO();
          }
        },
        {
          text: 'Tidak',
          role: 'cancel',
          handler: () => {
            // code here
          }
        }
      ]
    });
    alert.present();
  }

  deleteTableTransSO() {
    this.sqlite.create({
      name: 'vci_mobile.db',
      location: 'default'
    }).then((db: SQLiteObject) => {
      db.executeSql('DELETE FROM trans_so ', [])
        .then(res => {
          console.log("Success DELETE table trans_so", res);
          console.log("Nomor SO", this.noso);
          this.deleteTableTransSoDet();
        })
        .catch(e => console.log("Failed  DELETE table trans_so", e));
    });
  }

  deleteTableTransSoDet() {
    this.sqlite.create({
      name: 'vci_mobile.db',
      location: 'default'
    }).then((db: SQLiteObject) => {
      db.executeSql('DELETE FROM trans_so_det ', [])
        .then(res => {
          console.log("Success DELETE table trans_so_det", res);
          console.log("Nomor SO", this.noso);
          this.deleteTableTransSoDisc();
        })
        .catch(e => console.log("Failed  DELETE table trans_so_det", e));
    });
  }

  deleteTableTransSoDisc() {
    this.sqlite.create({
      name: 'vci_mobile.db',
      location: 'default'
    }).then((db: SQLiteObject) => {
      db.executeSql('DELETE FROM trans_so_disc ', [])
        .then(res => {
          console.log("Success DELETE table trans_so_disc", res);
          console.log("Nomor SO", this.noso);
          this.storage.remove('isCheckIn');
          this.storage.remove('outlet_temp');
          this.navCtrl.pop();
        })
        .catch(e => console.log("Failed  DELETE table trans_so_disc", e));
    });
  }

  // showMenuPane() {
  //   this.alertTrans = new CupertinoPane(
  //     '.alert-cupertino-pane', // Pane container selector
  //     {
  //       parentElement: 'body', // Parent container
  //       breaks: {
  //         top: { enabled: false, height: 600, bounce: true },
  //         middle: { enabled: true, height: 350, bounce: true },
  //         bottom: { enabled: false, height: 80 },
  //       },
  //       buttonClose: true,
  //       backdrop: true,
  //       backdropOpacity: 0.4,
  //       initialBreak: 'middle'
  //     }
  //   );
  //   this.alertTrans.present({ animate: true });
  // }

  // closeMenuPane() {
  //   this.alertTrans.destroy({ animate: true });
  //   this.storage.remove('outlet_temp');
  //   this.storage.remove('isCheckIn');
  //   this.navCtrl.setRoot(HomePage);
  // }

  createNote() {
    const prompt = this.alertCtrl.create({
      enableBackdropDismiss: false,
      title: "Pesan",
      message: "Catatan Sellout",
      inputs: [
        {
          name: "note",
          placeholder: "ketik pesan disini",
          type: "text",
          id: "maxLength"
        }
      ],
      buttons: [
        {
          text: "Batal",
          handler: (data) => {
          }
        }, {
          text: "Simpan",
          handler: (data) => {
            this.note = data.note;
          }
        }
      ]
    });
    prompt.present().then(result => { document.getElementById('maxLength').setAttribute('maxlength', '25'); });
  }



}
