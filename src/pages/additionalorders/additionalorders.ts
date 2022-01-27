import { Component, ViewChild, ElementRef } from '@angular/core';
import { IonicPage, NavController, NavParams, ModalController, AlertController, LoadingController, ToastController, Platform, App } from 'ionic-angular';
import { TambahprodukPage } from '../tambahproduk/tambahproduk';
import { Storage } from '@ionic/Storage';
import { SQLite, SQLiteObject } from '@ionic-native/sqlite';
import { HomePage } from '../home/home';
import { PostProvider } from '../../providers/post-provider';

import swal from 'sweetalert';

@IonicPage()
@Component({
  selector: 'page-additionalorders',
  templateUrl: 'additionalorders.html',
})
export class AdditionalordersPage {

  @ViewChild('myInput') myInput: ElementRef;

  tipecheckin: any;
  tipecheckinmodel: any;

  idcheckin: any;
  kdsalesman: any;
  kdoutlet: any;
  // nama_outlet: any;
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

  pick_month_expr: String = new Date().toISOString();

  nama_outlet: any;
  kd_outlet: any; t
  kd_disc: any;
  disc: any;
  trm: any;
  payflag: any;
  tipepromo: any;

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
    public app: App

  ) {

    // this.platform.ready().then(() => {

    // document.addEventListener('backbutton', () => {
    //   if (!this.navCtrl.canGoBack()) {
    //     this.platform.exitApp()
    //     return;
    //   }
    //   this.cancelTrans();
    // }, false);

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

    this.tipecheckinmodel = "24";

    this.loadTipeCekin();
    // get data from kunjungan page
    this.getCurrentData();

    this.storage.get('session_user_salesman').then((res) => {
      this.kdcabang = res[0].KdCabang;
      this.kdgudang = res[0].KdGudang;
      this.kdsales = res[0].KdSales;
      this.iduser = res[0].Id;
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
    this.storage.get("outlet_temp").then((res) => {
      this.nama_outlet = res[0].Nama;
      this.kd_outlet = res[1].KdOutlet;
      this.kd_disc = res[2].KdDisc;
      this.disc = parseInt(this.kd_disc);
      this.trm = res[3].Trm;
      this.payflag = res[4].payflag;
      console.log('outlet temp : ', res);
    });
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad AdditionalordersPage');
  }

  ionViewDidEnter() {
    this.select_db();
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
  }

  selectTypeCheckIn($event) {
    this.statuscekin = $event;
    console.log("status terpilih : ", this.statuscekin);
  }

  addProduct() {
    const modal = this.modalCtrl.create(TambahprodukPage);
    modal.present();

    modal.onDidDismiss(data => {
      console.log('OnDismisaModal Data ', data);
      this.select_db();
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
                    this.netto_trans_so = res.rows.item(0).netto_so;
                    this.jumlah_trans_so = res.rows.item(0).jml_so;
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

  // Show option to delete data item
  showOption(noso, pcode) {
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
    });
    return await this.loader.present();
  }

  getCheckoutSendTransaction() {
    if (this.tipecheckinmodel == '00') {
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
          db.executeSql('SELECT * FROM trans_so_disc WHERE send_status = ? AND NoSO = ? AND Nilai not null AND Nilai != 0', [0, this.noso])
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
          db.executeSql('SELECT * FROM trans_so_det WHERE send_status = ? AND NoSO = ? AND Qty != 0', [0, this.noso])
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
                      FROM trans_so WHERE send_status = 0 AND NoSO = ? ORDER BY AddDate LIMIT 1', [this.noso])
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
              // code here
            }
          },
          {
            text: 'Kirim',
            handler: () => {
              this.sentTransaction();
            }
          }
        ]
      });
      confirm.present();

    }

  }

  // Sending Transaction
  sentTransaction() {
    // this.selectTransactionDisc();
    if (this.kdsales.length >= 6) {
      this.selectTransactionDiscSPG();
      // alert('SPG');
    } else {
      // alert('SALESMAN');
      this.selectTransactionDisc();
    }
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
          subTitle: 'Tidak tersabung dengan Internet, cek kembali signal atau kuota internet anda',
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
          subTitle: 'Tidak tersabung dengan Internet, cek kembali signal atau kuota internet anda',
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
        this.navCtrl.setRoot(HomePage);
        this.storage.remove('outlet_temp');
        // const alert = this.alertCtrl.create
        //   ({
        //     title: 'Data terkirim',
        //     subTitle: 'Transaksi kunjungan di outlet ' + this.nama_outlet + ' berhasil terkirim.',
        //     buttons: [
        //       {
        //         text: 'Ok',
        //         handler: () => {
        //           this.storage.remove('outlet_temp');
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
          subTitle: 'Tidak tersabung dengan Internet, cek kembali signal atau kuota internet anda. [GetNoso]',
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
      const alert = this.alertCtrl.create
        ({
          title: 'Pehatian',
          subTitle: 'Tidak tersabung dengan Internet, cek kembali signal atau kuota internet anda. [Disc]',
          // buttons: ['OK']
          buttons: [
            {
              text: 'Kirim Ulang',
              handler: () => {
                // this.sentTransaction();
                this.deleteDisc();
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
        // const toast = this.toastCtrl.create({
        //   message: 'No SO Valid',
        //   duration: 2000,
        //   position: 'top'
        // });
        // toast.present();
      } else {
        this.loader.dismiss();
        const toast = this.toastCtrl.create({
          message: 'No SO Tidak Valid',
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
        this.navCtrl.setRoot(HomePage);
        this.storage.remove('outlet_temp');

        // var noso_online = data.result;
        // if (noso_online == null || noso_online == '' || noso_online == '0' || noso_online == 0) {
        //   this.storage.set('noso', 0);
        // } else {
        //   this.storage.set('noso', noso_online);
        //   console.log('noso', noso_online);
        // }
        // this.loader.dismiss();

        // this.transAlert = 1;

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
      title: 'Transaksi dibatalkan?',
      buttons: [
        {
          text: 'Ya',
          handler: () => {
            // run on mobile
            this.deleteTableTransSO();

            // run on browser
            // this.storage.remove('outlet_temp');
            // this.navCtrl.pop();
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
      db.executeSql('DELETE FROM trans_so WHERE noso = ?', [this.noso])
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
      db.executeSql('DELETE FROM trans_so_det WHERE noso = ?', [this.noso])
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
      db.executeSql('DELETE FROM trans_so_disc WHERE noso = ?', [this.noso])
        .then(res => {
          console.log("Success DELETE table trans_so_disc", res);
          console.log("Nomor SO", this.noso);
          this.storage.remove('outlet_temp');
          this.navCtrl.setRoot(HomePage);
        })
        .catch(e => console.log("Failed  DELETE table trans_so_disc", e));
    });
  }

}
