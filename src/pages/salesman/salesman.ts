import { Component, NgZone, ViewChild } from '@angular/core';
import { IonicPage, NavController, NavParams, ModalController, ToastController, AlertController, LoadingController, ActionSheetController, Platform, Slides } from 'ionic-angular';
import { Storage } from '@ionic/Storage';
import { SQLite, SQLiteObject } from '@ionic-native/sqlite';
import { CupertinoPane } from 'cupertino-pane';
import {
  BackgroundGeolocation,
  BackgroundGeolocationConfig,
  BackgroundGeolocationResponse,
  BackgroundGeolocationEvents
} from '@ionic-native/background-geolocation';

import swal from 'sweetalert';

// import { Toast } from '@ionic-native/toast';

// import { MenusalesmanPage } from '../menusalesman/menusalesman';
import { PostProvider } from '../../providers/post-provider';
import { KunjunganPage } from '../kunjungan/kunjungan';
import { OutletPage } from '../outlet/outlet';
import { PilihoutletPage } from '../pilihoutlet/pilihoutlet';
import { ProdukPage } from '../produk/produk';
import { HistorycheckinPage } from '../historycheckin/historycheckin';
import { HistorytransPage } from '../historytrans/historytrans';
import { Geolocation } from '@ionic-native/geolocation';
import { MenusalesmanPage } from '../menusalesman/menusalesman';
import { VisitapprovalPage } from '../visitapproval/visitapproval';
import { ChecktransPage } from '../checktrans/checktrans';
import { CheckvisitPage } from '../checkvisit/checkvisit';
import { CataloguePage } from '../catalogue/catalogue';
// import { CheckinPage } from '../checkin/checkin';


@IonicPage()
@Component({
  selector: 'page-salesman',
  templateUrl: 'salesman.html',
})
export class SalesmanPage {

  @ViewChild(Slides) slides: Slides;

  n_link: any;

  date = new Date();
  myDate: String = new Date(this.date.getTime() - this.date.getTimezoneOffset() * 60000).toISOString();

  todayDate: String = new Date().toISOString();
  today: any;
  bulan_aktif: any;
  tahun_aktif: any;
  full_name: any;
  username: any;
  total_sales: any;
  total_sales2: any;
  target_sales: any;
  kdcabang: any;
  kdsales: any;
  kdgudang: any;
  iduser: any;
  daylight: any;
  loader: any;
  enable: any;

  salesmanMenuPane: any;
  syncMenuPane: any;
  isSync: any;

  currentIndex: number = 1;

  lat: any;
  lng: any;

  tipe_user: any;
  check_salesman_btn: any;

  checkGeolocation: any;
  datalocation: any;
  status: any;
  statusfake: any;

  constructor(
    private sqlite: SQLite,
    public navCtrl: NavController,
    public navParams: NavParams,
    private storage: Storage,
    public modalCtrl: ModalController,
    // private toast: Toast,
    public toastCtrl: ToastController,
    public alertCtrl: AlertController,
    public postPvdr: PostProvider,
    public loadingCtrl: LoadingController,
    public geolocation: Geolocation,
    public actionSheetCtrl: ActionSheetController,
    public platform: Platform,
    private backgroundGeolocation: BackgroundGeolocation,
    public zone: NgZone
  ) {

    this.enable = 0;

    // 
    this.storage.get('session_user_login').then((res) => {
      this.full_name = res[0].employee_name;
      this.username = res[0].username;
      // this.getTotalSalesThisMonth();

    });

    this.storage.get('session_user_salesman').then((res) => {
      this.kdcabang = res[0].KdCabang;
      this.kdgudang = res[0].KdGudang;
      this.kdsales = res[0].KdSales;
      this.iduser = res[0].Id;
      this.tipe_user = res[0].KodeTipeUser;
      console.log('KodeTipeUser ', this.tipe_user);
      if (this.tipe_user == 'STD001') {
        // this.check_salesman_btn = 1;
        this.getTotalSalesThisMonth();
      }
      // if (this.tipe_user != 'STD001') {
      //   this.currentIndex = this.slides.getActiveIndex();
      //   if (this.currentIndex == 0) {
      //     this.slides.slideNext();
      //   }
      //   console.log('slide : ', this.currentIndex)
      // }
    });

    console.log('Time ', this.myDate.substring(11, 19));
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

    this.getBulan();
    this.getTahun();
  
    // this.platform.ready().then(() => {
    //   if (this.platform.is('android')) {
    //     this.geolocation.getCurrentPosition().then((resp) => {
    //       this.lat = resp.coords.latitude;
    //       this.lng = resp.coords.longitude;
    //       alert(this.lat, this.lng)
    //     }).catch((error) => {
    //       alert('GPS Mobile Device Anda tidak berfungsi dengan baik, silahkan tutup aplikasi dan buka kembali')
    //     });
    //   } else {
    //     console.log("You are running on browser");
    //   }
    // });

    // this.geolocation.getCurrentPosition().then((resp) => {
    //   this.lat = resp.coords.latitude;
    //   this.lng = resp.coords.longitude;
    // }).catch((error) => {
    //   alert('GPS Mobile Device Anda tidak berfungsi dengan baik, silahkan tutup aplikasi dan buka kembali')
    // });

    let watch = this.geolocation.watchPosition();
    watch.subscribe((data) => {
      this.lat = data.coords.latitude;
      this.lng = data.coords.longitude;
      // console.log("watchPosition Lat ", this.lat);
      // console.log("watchPosition lng ", this.lng);
    });

    // this.checkFakeGps();

  }

  checkFakeGps() {
    const config: BackgroundGeolocationConfig = {
      desiredAccuracy: 10,
      stationaryRadius: 20,
      distanceFilter: 30,
      notificationTitle: '',
      notificationText: '',
      // notificationsEnabled: false,
      // startForeground: false,
      debug: false, //  enable this hear sounds for background-geolocation life-cycle.
      stopOnTerminate: true // enable this to clear background location settings when the app terminates
    };
    this.backgroundGeolocation.configure(config).then(() => {
      this.checkGeolocation = this.backgroundGeolocation
        .on(BackgroundGeolocationEvents.location)
        .subscribe((location: BackgroundGeolocationResponse) => {

          this.zone.run(() => {
            this.datalocation = JSON.stringify(location);
            console.log(location);
          });

          if (location.isFromMockProvider == true) {
            this.statusfake = "Y";
            this.status = "Fake GPS detected!";
            const alert = this.alertCtrl.create({
              subTitle: 'We detected you using the Fake GPS application. Turn off the application immediately.',
              // buttons: ['OK']
              buttons: [
                {
                  text: 'Oke',
                  handler: () => {
                    this.platform.exitApp();
                    console.log('exiting app....')
                  }
                }
              ]
            });
            alert.present();
            this.storage.set('fakegps', this.statusfake);
          } else {
            this.status = "";
            this.statusfake = "N";
            this.storage.set('fakegps', this.statusfake);
          }
        });
    });

    this.backgroundGeolocation.start();
  }

  removeSync() {
    this.storage.remove('isSync');
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad SalesmanPage');
    //comment if run serve
    // this.getTransSoPending();
  }

  ionViewDidEnter() {
    this.getCheckVersionApp();
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

  // ionViewDidLeave() {
  //   this.closeMenuPane();
  // }

  getTahun() {
    this.tahun_aktif = this.todayDate;
    this.tahun_aktif = this.tahun_aktif.substring(0, 4);
    console.log('Tahun ', this.tahun_aktif);
  }

  getBulan() {
    this.bulan_aktif = this.todayDate;
    this.bulan_aktif = this.bulan_aktif.substring(5, 7);
    console.log('Bulan ', this.bulan_aktif);
  }

  async presentLoading(x) {
    this.loader = await this.loadingCtrl.create({
      content: x,
      // duration: 2000
    });
    return await this.loader.present();
  }

  underDevelopment() {
    const toast = this.toastCtrl.create({
      message: 'Menu ini masih dalam tahap pengembangan.',
      duration: 2000,
      position: 'bottom'
    });
    toast.present();
  }

  goToHistoryTransaction() {
    this.navCtrl.push(HistorytransPage);
  }

  goToMenuSalesman() {
    this.navCtrl.push(MenusalesmanPage);
  }

  goToCatalogue() {
    this.navCtrl.push(CataloguePage);
  }

  presentActionSheet() {
    const actionSheet = this.actionSheetCtrl.create({
      title: 'Menu Admin',
      buttons: [
        {
          text: 'Persetujan Kunjungan',
          handler: () => {
            console.log('VisitapprovalPage clicked');
            this.navCtrl.push(VisitapprovalPage);
          }
        }, {
          text: 'Cek Transaksi Salesman',
          handler: () => {
            console.log('ChecktransPage clicked');
            this.navCtrl.push(ChecktransPage);
          }
        }, {
          text: 'Cek Kunjungan Salesman',
          handler: () => {
            console.log('CheckvisitPage clicked');
            this.navCtrl.push(CheckvisitPage);
          }
        }, {
          text: 'Batal',
          role: 'cancel',
          handler: () => {
            console.log('Cancel clicked');
          }
        }
      ]
    });
    actionSheet.present();
  }

  getTransSoPending() {
    this.sqlite.create({
      name: 'vci_mobile.db',
      location: 'default'
    }).then((db: SQLiteObject) => {

      db.executeSql('select * from trans_so where send_status = ?', [0]).then(res => {
        if (res.rows.length > 0) {
          document.getElementById('normal').style.display = 'none';
          document.getElementById('pending').style.display = '';
        } else {
          document.getElementById('normal').style.display = '';
          document.getElementById('pending').style.display = 'none';
        }
        console.log("Success select table trans_so", res);
      }).catch(e => {
        console.log("Failed select table trans_so", e);
      });

    });
  }

  getTotalSalesThisMonth() {
    this.presentLoading('Mohon tunggu');
    let body = {
      username: this.username,
      kdcabang: this.kdcabang,
      kdgudang: this.kdgudang,
      kdsales: this.kdsales,
      aksi: 'total_sales_this_month'
    };
    this.postPvdr.postData(body, 'TotalSales').subscribe((data) => {
      if (data.success) {
        this.loader.dismiss();
        this.total_sales = data.result[0].Netto_format;
      }
    }, error => {
      this.loader.dismiss();
      const confirm = this.alertCtrl.create({
        // title: 'Terkendala koneksi',
        message: 'Koneksi internet terputus, silahkan muat ulang atau coba lagi beberapa saat.',
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
            }
          }
        ]
      });
      confirm.present();
      this.total_sales = '0';
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
    this.postPvdr.postData(body, 'TotalSales').subscribe((data) => {
      if (data.success) {
        this.total_sales2 = data.result[0].Netto_format;
      }
    }, error => {
      const toast = this.toastCtrl.create({
        message: 'Kamu sedang tidak terhubung dengan server cabang/depo',
        showCloseButton: true,
        position: 'top',
        closeButtonText: 'Ok'
      });
      toast.present();
      this.total_sales2 = '0';
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
    this.postPvdr.postData(body, 'TotalSales').subscribe((data) => {
      if (data.success) {
        this.target_sales = data.result[0].nilai;
      }
    }, error => {
      const toast = this.toastCtrl.create({
        message: 'Kamu sedang tidak terhubung dengan server cabang/depo',
        showCloseButton: true,
        position: 'top',
        closeButtonText: 'Ok'
      });
      toast.present();
      this.target_sales = '0';
    });

  }

  goToKunjungan() {
    this.navCtrl.push(KunjunganPage);
  }

  goToHistoryCheckIn() {
    this.navCtrl.push(HistorycheckinPage)
  }

  getSync() {
    this.storage.remove('outlet_temp');
    this.getMasterOutlet();
  }

  showMenuSales() {
    this.showMenuPane();
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
      aksi: 'get_idcheckin',
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

  goToOutletPage() {
    this.navCtrl.push(OutletPage)
  }

  goToKunjunganPage() {
    this.navCtrl.push(PilihoutletPage);
  }

  goToProductPage() {
    this.navCtrl.push(ProdukPage)
  }

  goToCheckVisit() {
    this.navCtrl.push(CheckvisitPage)
  }

  goToCheckTrans() {
    this.navCtrl.push(ChecktransPage);
  }

  goToVisitApproval() {
    this.navCtrl.push(VisitapprovalPage)
  }



















  showMenuPane() {
    this.syncMenuPane = new CupertinoPane(
      '.sync-cupertino-pane', // Pane container selector
      {
        parentElement: 'body', // Parent container
        breaks: {
          // top: { enabled: true, height: 480, bounce: true },
          middle: { enabled: true, height: 450, bounce: true },
          bottom: { enabled: false, height: 80 },
        },
        buttonClose: false,
        clickBottomOpen: true,
        initialBreak: 'middle'
      }
    );
    this.syncMenuPane.present({ animate: true });

    this.salesmanMenuPane = new CupertinoPane(
      '.salesman-cupertino-pane', // Pane container selector
      {
        parentElement: 'body', // Parent container
        breaks: {
          top: { enabled: false, height: 400, bounce: true },
          middle: { enabled: true, height: 300, bounce: true },
          bottom: { enabled: false, height: 80 },
        },
        buttonClose: true,
        bottomClose: false,
        clickBottomOpen: true,
        initialBreak: 'middle'
      }
    );
    this.salesmanMenuPane.present({ animate: true });


  }

  closeMenuPane() {
    this.salesmanMenuPane.destroy({ animate: true });
    this.syncMenuPane.destroy({ animate: true });
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
