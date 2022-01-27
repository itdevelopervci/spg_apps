import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ViewController, LoadingController, ToastController, AlertController } from 'ionic-angular';
import { SQLite, SQLiteObject } from '@ionic-native/sqlite';
import { PostProvider } from '../../providers/post-provider';
import { Storage } from '@ionic/Storage';
import { HomePage } from '../home/home';

import swal from 'sweetalert';


@IonicPage()
@Component({
  selector: 'page-historytranspendingdetail',
  templateUrl: 'historytranspendingdetail.html',
})
export class HistorytranspendingdetailPage {

  noso: any;
  outlet: any;
  tgl_so: any;
  keterangan: any;
  netto2: any;
  netto: any;
  trans_so_det_list: any;
  loader: any;
  trans_so: any;
  trans_so_det: any;
  trans_so_disc: any;
  kdcabang: any;
  kdgudang: any;
  kdsales: any;
  iduser: any;
  netto_trans_so: any;

  constructor(
    private storage: Storage,
    public alertCtrl: AlertController,
    public toastCtrl: ToastController,
    public postPvdr: PostProvider,
    public loadingCtrl: LoadingController,
    private sqlite: SQLite,
    public viewCtrl: ViewController,
    public navCtrl: NavController,
    public navParams: NavParams) {

    this.getCurrentData(
      navParams.get('noso'),
      navParams.get('outlet')
    );

    this.storage.get('session_user_salesman').then((res) => {
      this.kdcabang = res[0].KdCabang;
      this.kdgudang = res[0].KdGudang;
      this.kdsales = res[0].KdSales;
      this.iduser = res[0].Id;
    });

  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad HistorytranspendingdetailPage');
  }

  // getDismiss() {
  //   this.navCtrl.pop();
  // }

  async presentLoading() {
    this.loader = await this.loadingCtrl.create({
      content: "",
      // duration: 2000
    });
    return await this.loader.present();
  }

  getCurrentData(noso, outlet) {
    this.noso = noso;
    this.outlet = outlet;
    this.getTransSoPending();
    this.deleteDisc(this.noso);
  }

  getTransSoPending() {
    this.sqlite.create({
      name: 'vci_mobile.db',
      location: 'default'
    }).then((db: SQLiteObject) => {

      // trans_so
      db.executeSql('select sum(netto2) as netto2, sum(netto) as netto, Keterangan, TglSO from trans_so where noso = ?', [this.noso]).then(res => {
        console.log("Success select table trans_so where noso : " + this.noso + "", res);
        this.netto2 = res.rows.item(0).netto2;
        this.netto = res.rows.item(0).netto;
        this.keterangan = res.rows.item(0).Keterangan;
        this.tgl_so = res.rows.item(0).TglSO;
      }).catch(e => {
        console.log("Failed select table trans_so", e);
      });

      db.executeSql('select * from trans_so_det where noso = ?', [this.noso]).then(res => {
        console.log("Success select table trans_so_det where noso : " + this.noso + "", res);
        this.trans_so_det_list = [];
        for (let i = 0; i < res.rows.length; i++) {
          this.trans_so_det_list.push({
            'number': [i + 1],
            'noso': res.rows.item(i).NoSO,
            'pcode': res.rows.item(i).PCode,
            'namabarang': res.rows.item(i).NamaBarang,
            'qty': res.rows.item(i).Qty,
            'jenis': res.rows.item(i).Jenis,
            'jumlah': res.rows.item(i).Jumlah,
            'netto': res.rows.item(i).Netto,
            'adddate': res.rows.item(i).AddDate,
            'keterangan': res.rows.item(i).Keterangan
          })
        }
      }).catch(e => {
        console.log("Failed select table trans_so_det", e);
      });

      db.executeSql('select sum(netto) as netto_so from trans_so where noso = ?', [this.noso])
        .then(res => {
          if (res.rows.length > 0) {
            console.log("Success SELECT table trans_so_det", this.noso)
            // for (let i = 0; i < res.rows.length; i++) {
            // this.netto_so.push({
            this.netto_trans_so = res.rows.item(0).netto_so;
            // });

            // }
          } else {
            console.log("Failed SELECT table trans_so_det", res)
          }
        })
        .catch(e => console.log("Failed SELECT table trans_so_det", e));

    });

  }

  sendTransaction() {
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

    const confirm = this.alertCtrl.create({
      title: 'Perhatian',
      message: 'Transaksi ini akan di kirim?',
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
            this.selectTransactionDiscSPG();
          }
        }
      ]
    });
    confirm.present();

  }

  deleteDisc(noso) {
    let body = {
      noso: noso,
      aksi: 'delete_trans_so_disc_spg'
    };
    this.presentLoading();
    this.postPvdr.postData(body, 'Transaction').subscribe((data) => {
      if (data.success) {
        this.loader.dismiss();
        // this.selectTransactionDiscSPG();
        const toast = this.toastCtrl.create({
          message: 'No SO Valid',
          duration: 2000,
          position: 'top'
        });
        toast.present();
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
                this.deleteDisc(noso);
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
                this.sendTransaction();
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

        // this.transAlert = 1;

        swal("Terkirim", "Data telah terkirim", "success")
          .then((value) => {
            console.log('Ok Clicked');
            this.storage.remove('outlet_temp');
            this.storage.remove('isCheckIn');
            this.navCtrl.setRoot(HomePage);
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
          buttons: [
            {
              text: 'Kirim Ulang',
              handler: () => {
                console.log('Disagree clicked');
                this.sendTransaction();
              }
            },
            {
              text: 'Ok',
              handler: () => {
                console.log('Agree clicked');
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
        // update status
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
          subTitle: 'Tidak tersabung dengan Internet, cek kembali signal atau kuota internet anda. [Det]',
          buttons: [
            {
              text: 'Kirim Ulang',
              handler: () => {
                console.log('Disagree clicked');
                this.sendTransaction();
              }
            },
            {
              text: 'Ok',
              handler: () => {
                console.log('Agree clicked');
              }
            }
          ]
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
          subTitle: 'Tidak tersabung dengan Internet, cek kembali signal atau kuota internet anda. [Head]',
          buttons: [
            {
              text: 'Kirim Ulang',
              handler: () => {
                console.log('Disagree clicked');
                this.sendTransaction();
              }
            },
            {
              text: 'Ok',
              handler: () => {
                console.log('Agree clicked');
              }
            }
          ]
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
        const alert = this.alertCtrl.create
          ({
            title: 'Data terkirim',
            subTitle: 'Transaksi di outlet ' + this.outlet + ' berhasil terkirim.',
            buttons: [
              {
                text: 'Ok',
                handler: () => {
                  this.storage.remove('outlet_temp');
                  // this.getDismiss(true);
                  this.navCtrl.setRoot(HomePage);
                }
              }
            ]
          });
        alert.present();
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
          subTitle: 'Tidak tersabung dengan Internet, cek kembali signal atau kuota internet anda. [Noso]',
          buttons: [
            {
              text: 'Kirim Ulang',
              handler: () => {
                console.log('Disagree clicked');
                this.getNoSo();
              }
            },
            {
              text: 'Ok',
              handler: () => {
                console.log('Agree clicked');
              }
            }
          ]
        });
      alert.present();
    });

  }

  getDismiss(reload) {
    this.viewCtrl.dismiss({ reload: reload });
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



}
