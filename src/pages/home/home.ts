import { Component, ViewChild } from '@angular/core';
import { NavController, ActionSheetController, LoadingController, AlertController, ToastController, Platform, Slides } from 'ionic-angular';
import { Storage } from '@ionic/Storage';
import { PostProvider } from '../../providers/post-provider';
import { SQLite, SQLiteObject } from "@ionic-native/sqlite";
import { AppVersion } from '@ionic-native/app-version';

import { SalesmanPage } from '../salesman/salesman';
import { DistributionPage } from '../distribution/distribution';
import { MarketingPage } from '../marketing/marketing';
import { HistorydetailcheckinPage } from '../historydetailcheckin/historydetailcheckin';
import { HistorytransPage } from '../historytrans/historytrans';
import { LoginPage } from '../login/login';
import { SelloutPage } from '../sellout/sellout';


@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {

  @ViewChild(Slides) slides: Slides;

  emlpoyee_id: any;
  full_name: any;
  jabatan: any;
  divisi: any;
  loader: any;
  salesmanmenu: any;
  distmenu: any;
  mktmenu: any;
  homeMenu: any;
  slidesPerView: number = 1;
  currentIndex: number = 1;

  kdcabang: any;
  kdgudang: any;
  kdsales: any;
  username: any;
  iduser: any;
  checkin_list: any;
  checkin_list_spg: any;

  checkin: string = "listcheckin";

  datacheckin: any;

  logoutfunc: any;

  tipe_user: any;

  check_salesman_btn: any;

  versi: any;

  version_app: any;

  n_link: any;

  constructor(
    public navCtrl: NavController,
    private storage: Storage,
    public actionSheetCtrl: ActionSheetController,
    public postPvdr: PostProvider,
    public loadingCtrl: LoadingController,
    public alertCtrl: AlertController,
    public toastCtrl: ToastController,
    private sqlite: SQLite,
    private appVersion: AppVersion,
    private platform: Platform
  ) {

    // code here
    this.loadData();

    // this.appVersion.getAppName();
    // this.appVersion.getPackageName();
    // this.appVersion.getVersionCode();
    // this.appVersion.getVersionNumber();

    // console.log('appinfo : ', this.appVersion.getAppName());
    // console.log('appinfo : ', this.appVersion.getPackageName());
    // console.log('appinfo : ', this.appVersion.getVersionCode());
    // console.log('appinfo : ', this.appVersion.getVersionNumber());

    this.platform.ready().then(() => {
      if (this.platform.is('android')) {
        this.appVersion.getVersionNumber().then((res) => {
          console.log(res);
          this.versi = res;
        }, (err) => {
          console.log(err);
        });
      } else {
        this.versi = '0.1.13';
      }
    });


  }


  ionViewDidEnter() {
    this.slideChanged();
    this.checkin = "listcheckin";
    console.log('ionViewDidEnter HomePage');
  }

  slideChanged() {
    this.currentIndex = this.slides.getActiveIndex();
    if (this.currentIndex == 4) {
      this.slides.slideTo(4, 10);
    }
  }

  loadData() {
    this.storage.get('session_user_login').then((res) => {
      this.emlpoyee_id = res[0].employee_id;
      this.full_name = res[0].employee_name;
      this.jabatan = res[0].jabatan_name;
      this.divisi = res[0].divisi_name;
    });

    this.storage.get('session_user_salesman').then((res) => {
      if (res !== null) {
        this.kdcabang = res[0].KdCabang;
        this.kdgudang = res[0].KdGudang;
        this.kdsales = res[0].KdSales;
        this.username = res[0].UserName;
        this.iduser = res[0].Id;
        this.tipe_user = res[0].KodeTipeUser;
        console.log('KodeTipeUser ', this.tipe_user);
        console.log('length kode sales ', this.kdsales.length);
        if (this.tipe_user == 'STA001' || this.tipe_user == 'SPV001') {
          this.check_salesman_btn = 1;
        }

        if (this.kdsales.length >= 6) {
          this.getDataServerSPG(this.kdcabang, this.kdgudang, this.username);
        } else {
          this.getDataServer(this.kdcabang, this.kdgudang, this.username);
        }

        if (this.kdsales.length >= 6) {
          this.slides.slideTo(1, 10);
        }
      }
    });

  }

  presentActionSheet() {
    const confirm = this.alertCtrl.create({
      title: 'Logout',
      message: 'Apakah anda yakin untuk keluar dari aplikasi ini?',
      buttons: [
        {
          text: 'Batal',
          handler: () => {
            console.log('Disagree clicked');
          }
        },
        {
          text: 'Logout',
          handler: () => {
            console.log('Agree clicked');
            this.logout();
          }
        }
      ]
    });
    confirm.present();
  }

  logout() {

    // run on mobile device
    this.deleteTableCheckIn();

    // if serve on browser
    // this.storage.clear();
    // this.navCtrl.setRoot(LoginPage);

  }

  deleteTableCheckIn() {
    this.sqlite.create({
      name: 'vci_mobile.db',
      location: 'default'
    }).then((db: SQLiteObject) => {
      // db.executeSql('DELETE FROM cek_in', []) 
      db.executeSql('DROP TABLE cek_in', [])
        .then(res => {
          console.log("Success DELETE table cek_in", res);
          this.deleteTableTransSO();
        })
        .catch(e => console.log("Failed  DELETE table cek_in", e));
    });
  }

  deleteTableTransSO() {
    this.sqlite.create({
      name: 'vci_mobile.db',
      location: 'default'
    }).then((db: SQLiteObject) => {
      // db.executeSql('DELETE FROM trans_so', [])
      db.executeSql('DROP TABLE trans_so', [])
        .then(res => {
          console.log("Success DELETE table trans_so", res);
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
      // db.executeSql('DELETE FROM trans_so_det', [])
      db.executeSql('DROP TABLE trans_so_det', [])
        .then(res => {
          console.log("Success DELETE table trans_so_det", res);
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
      // db.executeSql('DELETE FROM trans_so_disc', [])
      db.executeSql('DROP TABLE trans_so_disc', [])
        .then(res => {
          console.log("Success DELETE table trans_so_disc", res);
          this.storage.clear();
          this.navCtrl.setRoot(LoginPage);
          this.platform.exitApp();
        })
        .catch(e => console.log("Failed  DELETE table trans_so_disc", e));
    });
  }

  async presentLoading(x) {
    this.loader = await this.loadingCtrl.create({
      content: x,
    });
    return await this.loader.present();
  }

  openSalesmanPage() {
    if (this.kdsales.length >= 6) {
      const alert = this.alertCtrl.create
        ({
          title: 'Pehatian',
          subTitle: 'Tidak ada akses.',
          buttons: ['OK']
        });
      alert.present();
    } else {
      this.navCtrl.push(SalesmanPage);
    }
  }

  openSelloutPage() {
    this.navCtrl.push(SelloutPage);
  }

  openDistributionPage() {
    this.storage.get("session_user_distribution").then((res) => {
      if (res == null) {
        this.loginDist();
      } else {
        this.navCtrl.push(DistributionPage);
      }
    });
  }

  loginDist() {
    const prompt = this.alertCtrl.create({
      title: 'Login',
      message: "Masukan username dan password untuk membuka menu distribusi",
      inputs: [
        {
          name: 'username',
          placeholder: 'Username'
        },
        {
          name: 'password',
          type: 'password',
          placeholder: 'Password'
        },
      ],
      buttons: [
        {
          text: 'Batal',
          handler: data => {
            // code here
          }
        },
        {
          text: 'Login',
          handler: data => {
            let body = {
              username: data.username,
              password: data.password,
              aksi: 'login_distribution'
            };

            this.presentLoading('');
            this.postPvdr.postData(body, 'LoginApplication').subscribe((data) => {
              var alertpesan = data.msg;
              if (data.success) {
                this.loader.dismiss();
                this.storage.set('session_user_distribution', data.result);
                this.navCtrl.push(DistributionPage);
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
      ]
    });
    prompt.present();
  }

  openMarketingPage() {
    this.navCtrl.push(MarketingPage);
  }

  getDataServer(kdcabang, kdgudang, username) {
    let body = {
      kdcabang: kdcabang,
      kdgudang: kdgudang,
      username: username,
      aksi: 'get_checkin_data',
    };
    this.presentLoading('');
    this.postPvdr.postData(body, 'Checkin').subscribe((data) => {
      // var alertmsg = data.msg;
      if (data.success) {
        this.loader.dismiss().catch();
        this.datacheckin = 1;
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
              this.getDataServer(kdcabang, kdgudang, username);
            }
          }
        ]
      });
      confirm.present();
    });

  }

  getDataServerSPG(kdcabang, kdgudang, username) {
    let body = {
      kdcabang: kdcabang,
      kdgudang: kdgudang,
      username: username,
      aksi: 'get_checkin_data_spg',
    };
    this.presentLoading('');
    this.postPvdr.postData(body, 'Checkin').subscribe((data) => {
      // var alertmsg = data.msg;
      if (data.success) {
        this.loader.dismiss().catch();
        this.datacheckin = 2;
        this.checkin_list_spg = [];
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
          this.checkin_list_spg.push({
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
              this.getDataServer(kdcabang, kdgudang, username);
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

  goToHistoryTransaction() {
    this.navCtrl.push(HistorytransPage);
  }

  doRefresh(refresher) {
    this.storage.get('session_user_salesman').then((res) => {
      this.kdcabang = res[0].KdCabang;
      this.kdgudang = res[0].KdGudang;
      this.kdsales = res[0].KdSales;
      this.username = res[0].UserName;
      this.iduser = res[0].Id;
      // this.getDataServer(this.kdcabang, this.kdgudang, this.username);
      if (this.kdsales.length >= 6) {
        this.getDataServerSPG(this.kdcabang, this.kdgudang, this.username);
      } else {
        this.getDataServer(this.kdcabang, this.kdgudang, this.username);
      }
    });

    setTimeout(() => {
      refresher.complete();
    }, 2000);
  }

  getCheckVersionApp() {

    let body = {
      aksi: 'check_version',
    };

    this.postPvdr.postData(body, 'CheckVerison').subscribe((data) => {
      if (data.success) {

        this.n_link = String(data.result[0].Link);

        const confirm = this.alertCtrl.create({
          enableBackdropDismiss: false,
          title: 'Update Tersedia',
          message: 'Aplikasi salesman mempunyai versi terbaru.',
          buttons: [
            {
              text: 'Unduh',
              handler: () => {
                console.log('Download..');
                this.downloadApp(this.n_link);
              }
            }
          ]
        });
        confirm.present();
      }
    });

  }


  downloadApp(url: string) {
    window.open(url, '_system', 'location=yes');
  }


}
