import { Component, ElementRef, ViewChild } from '@angular/core';
import { AlertController, IonicPage, LoadingController, NavController, NavParams, ToastController } from 'ionic-angular';
import { Storage } from "@ionic/Storage";

import { PostProvider } from '../../providers/post-provider';
import { AdditionalordersPage } from '../additionalorders/additionalorders';

import { Map, tileLayer, marker } from "leaflet";

// declare var google;

@IonicPage()
@Component({
  selector: 'page-historydetailcheckin',
  templateUrl: 'historydetailcheckin.html',
})
export class HistorydetailcheckinPage {

  @ViewChild('map') mapElement: ElementRef;
  map: any;

  loader: any;

  kdcabang: any;
  kdgudang: any;
  kdsales: any;
  iduser: any;

  idcheckin: any;
  kdoutlet: any;
  nama_outlet: any;
  truelocation: any;
  latitude: any;
  longitude: any;
  statuscekin: any;
  waktuin: any;
  waktuout: any;
  nilai: any;
  trm: any;

  todayDate: String = new Date().toISOString();
  today: any;
  isSync: any;
  enable: any;

  tahun_aktif: any;
  bulan_aktif: any;

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    private storage: Storage,
    public toastCtrl: ToastController,
    public alertCtrl: AlertController,
    public postPvdr: PostProvider,
    public loadingCtrl: LoadingController) {

    this.getCurrentData(
      navParams.get('idcheckin'),
      navParams.get('kd_outlet'),
      navParams.get('nama_outlet'),
      navParams.get('on_loc'),
      navParams.get('lat'),
      navParams.get('lng'),
      navParams.get('keterangan'),
      navParams.get('waktu_cin'),
      navParams.get('waktu_cout'),
      navParams.get('nilai'),
      navParams.get('trm')
    );

  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad HistorydetailcheckinPage');
    // this.loadMap();
    this.loadMapGratis();
  }

  ionViewDidEnter() {
    this.today = this.todayDate.substring(0, 10);
    this.storage.get('isSync').then((res) => {
      this.isSync = res;
      console.log('Today : ', this.today);
      console.log('Sync : ', this.isSync);
      if (this.isSync != this.today || res == null) {
        this.storage.remove('isSync');
        this.enable = 0;
      } else {
        this.enable = 1;
        this.isSync = this.today;
      }
    });

    this.getTahun();
    this.getBulan();

  }

  getCurrentData(idcheckin, kd_outlet, nama_outlet, on_loc, lat, lng, keterangan, waktu_cin, waktu_cout, nilai, trm) {
    this.idcheckin = idcheckin;
    this.kdoutlet = kd_outlet;
    this.nama_outlet = nama_outlet;
    this.truelocation = on_loc;
    this.latitude = lng;
    this.longitude = lat;
    this.statuscekin = keterangan;
    this.waktuin = waktu_cin;
    this.waktuout = waktu_cout;
    this.nilai = nilai;
    this.trm = trm;

    this.storage.get('session_user_salesman').then((res) => {
      this.kdcabang = res[0].KdCabang;
      this.kdgudang = res[0].KdGudang;
      this.kdsales = res[0].KdSales;
      this.iduser = res[0].Id;
    });

  }

  async presentLoading(x) {
    this.loader = await this.loadingCtrl.create({
      content: x,
    });
    return await this.loader.present();
  }

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

  // loadMap() {
  //   let latLng = new google.maps.LatLng(this.latitude, this.longitude);
  //   let mapOptions = {
  //     center: latLng,
  //     zoom: 18,
  //     disableDefaultUI: true,
  //     draggable: false,
  //     zoomControl: true,
  //     scrollwheel: false,
  //     disableDoubleClickZoom: true,
  //     mapTypeId: google.maps.MapTypeId.ROADMAP
  //   }
  //   this.map = new google.maps.Map(this.mapElement.nativeElement, mapOptions);
  //   this.addMarker(this.map);
  // }

  // addMarker(map: any) {
  //   new google.maps.Marker({ map: map, animation: google.maps.Animation.DROP, position: map.getCenter() });
  // }

  loadMapGratis() {
    const map = new Map('map').setView([this.latitude, this.longitude], 23);

    tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
    }).addTo(map);

    marker([this.latitude, this.longitude]).addTo(map)
      .bindPopup('Posisi Anda')
      .openPopup();
  }

  getDismiss() {
    this.navCtrl.pop();
  }

  alertSync() {
    let alert = this.alertCtrl.create({
      title: 'Perhatian',
      message: 'Sinkronisasi terlebih dahulu',
      buttons: [
        {
          text: 'Ya',
          handler: () => {
            this.getMasterOutlet();
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

  reOrder() {

    if (this.enable == 0) {
      this.alertSync();
    } else {

      console.log(this.nama_outlet)
      console.log(this.kdoutlet)
      console.log(this.nilai)
      console.log(this.trm)

      var outlet_temp = [
        {
          Nama: this.nama_outlet
        }, {
          KdOutlet: this.kdoutlet
        }, {
          KdDisc: this.nilai
        }, {
          Trm: this.trm
        }, {
          payflag: 'K'
        }
      ];
      this.storage.set("outlet_temp", outlet_temp);
      this.navCtrl.setRoot(AdditionalordersPage);
    }

  }

  getMasterOutlet() {
    // this.salesmanMenuPane.hide();
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
        console.log(data.result)
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
        const alert = this.alertCtrl.create
          ({
            // title: 'Sukses',
            subTitle: 'Sinkronisasi berhasil',
            buttons: [
              {
                text: 'ok',
                handler: () => {
                  console.log('Agree clicked');
                  this.isSync = this.todayDate.substring(0, 10);
                }
              }
            ]
          });
        alert.present();
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

}
