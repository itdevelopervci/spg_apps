import { Component, ViewChild, ElementRef, NgZone } from "@angular/core";
import { IonicPage, NavController, NavParams, ModalController, LoadingController, AlertController, Platform, ToastController } from "ionic-angular";
import { PilihoutletPage } from "../pilihoutlet/pilihoutlet";
import { Storage } from "@ionic/Storage";
import { Geolocation } from "@ionic-native/geolocation";
import { CheckinPage } from "../checkin/checkin";
import { LocationAccuracy } from "@ionic-native/location-accuracy";
import {
  BackgroundGeolocation,
  BackgroundGeolocationConfig,
  BackgroundGeolocationResponse,
  BackgroundGeolocationEvents
} from '@ionic-native/background-geolocation';

// import { SQLite, SQLiteObject } from "@ionic-native/sqlite";

import { Map, tileLayer, marker } from "leaflet";

// declare var google;

@IonicPage()
@Component({ selector: "page-kunjungan", templateUrl: "kunjungan.html" })
export class KunjunganPage {

  @ViewChild("map") mapElement: ElementRef;
  map: any;
  lat: any;
  lng: any;
  posisi: string = "YES";
  loader: any;
  checknull: any;
  check_btn: any;
  idcheckin: any;
  idcekin_mobile: any;
  send_status: Number = 0;
  waktuin: any;
  yearnow: String = new Date().toISOString();
  today = new Date();
  date = this.today.getFullYear() + "-" + this.pickMonth(this.today.getMonth() + 1) + "-" + this.pickDate(this.today.getDate());
  myTime: String = new Date(this.today.getTime() - this.today.getTimezoneOffset() * 60000).toISOString();
  latLng: any;
  nama_outlet: any;
  kd_outlet: any;
  kd_disc: any;
  kdcabang: any;
  kdgudang: any;
  kdsales: any;
  iduser: any;
  checkGeolocation: any;
  datalocation: any;
  status: any;
  statusfake: any;

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    public modalCtrl: ModalController,
    private storage: Storage,
    private geolocation: Geolocation,
    public loadingCtrl: LoadingController,
    private locationAccuracy: LocationAccuracy,
    public alertCtrl: AlertController,
    public toastCtrl: ToastController,
    public platform: Platform,
    private backgroundGeolocation: BackgroundGeolocation,
    public zone: NgZone
    // private sqlite: SQLite
  ) {

    this.storage.get('session_user_salesman').then((res) => {
      this.kdcabang = res[0].KdCabang;
      this.kdgudang = res[0].KdGudang;
      this.kdsales = res[0].KdSales;
      this.iduser = res[0].Id;
    });

    this.locationAccuracy.canRequest().then((canRequest: boolean) => {
      if (canRequest) {
        this.locationAccuracy.request(this.locationAccuracy.REQUEST_PRIORITY_HIGH_ACCURACY).then(() =>
          console.log("Request successful"), (error) => console.log("Error requesting location permissions", error));
      }
    });

    // setInterval(() => this.getMyPlaces(), 3000);
    // this.getMyPlaces();

  }

  ionViewDidEnter() {
    this.getMyPlaces();
    this.getIdCheckIn();
    this.checkVisit();
    this.checkFakeGps();
  }

  
  ionViewWillLeave() {
    this.backgroundGeolocation.stop();
    this.checkGeolocation.unsubscribe();
    this.backgroundGeolocation.deleteAllLocations();
  }

  checkFakeGps() {
    const config: BackgroundGeolocationConfig = {
      desiredAccuracy: 10,
      stationaryRadius: 20,
      distanceFilter: 30,
      notificationTitle: 'GPS',
      notificationText: 'enable',
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
            console.log('Nama provider : ', location.provider);
          });

          if (location.isFromMockProvider == true) {
            this.alertFake();
            this.statusfake = "Y";
            this.storage.set('fakegps', this.statusfake);
            this.check_btn = this.statusfake;
          } else {
            this.status = "";
            this.statusfake = "N";
            this.storage.set('fakegps', this.statusfake);
            this.check_btn = this.statusfake;
          }
        });
    });

    this.backgroundGeolocation.start();

  }

  alertFake() {
    this.status = "Fake GPS terdeteksi!";
    const alert = this.alertCtrl.create({
      enableBackdropDismiss: false,
      title: this.status,
      subTitle: 'Aplikasi mendeteksi adanya aplikasi lain untuk merubah akurasi GPS Anda. Segera non-aktifkan aplikasi tersebut.',
      buttons: [
        // {
        //   text: 'Back',
        //   handler: () => {
        //     this.navCtrl.pop();
        //     console.log('exiting app....')
        //     this.backgroundGeolocation.stop();
        //     this.checkGeolocation.unsubscribe();
        //     this.backgroundGeolocation.deleteAllLocations();
        //   }
        // },
        {
          text: 'Oke',
          handler: () => {
            this.platform.exitApp();
            this.backgroundGeolocation.stop();
            this.checkGeolocation.unsubscribe();
            this.backgroundGeolocation.deleteAllLocations();
            console.log('exiting app....')
          }
        }
      ]
    });
    alert.present();
  }

  pickMonth(m) {
    if (m * 1 < 10) {
      m = "0" + m;
    } else {
      m = m;
    }
    return m;
  }

  pickDate(d) {
    if (d * 1 < 10) {
      d = "0" + d;
    } else {
      d = d;
    }
    return d;
  }

  monthNow(m) {
    if (m * 1 < 10) {
      m = "0" + m;
    } else {
      m = m;
    }
    return m;
  }

  dateNow(d) {
    if (d * 1 < 10) {
      d = "0" + d;
    } else {
      d = d;
    }
    return d;
  }

  ionViewDidLoad() {
    console.log("ionViewDidLoad KunjunganPage");
  }

  checkVisit() {
    this.storage.get("isCheckIn").then((res) => {
      if (res === 1) {
        this.navCtrl.push(CheckinPage);
      } else {
        this.storage.get("outlet_temp").then((res) => {
          if (res == null) {
            this.openModalOutlet();
            document.getElementById('checkinbtn').style.display = 'none';
          } else {
            document.getElementById('checkinbtn').style.display = '';
            this.storage.get("outlet_temp").then((res) => {
              this.nama_outlet = res[0].Nama;
              this.kd_outlet = res[1].KdOutlet;
              this.kd_disc = res[2].nilai;
              console.log(res);
            });
          }
        });
      }
    });
  }

  openModalOutlet() {
    const modal = this.modalCtrl.create(PilihoutletPage);
    modal.present();

    modal.onDidDismiss((data) => {
      console.log("huhui lemparan dari pilih outlet ", data);
      if (data.reload) {
        this.checkVisit();
      }
    });
  }

  addOutlet() {
    this.openModalOutlet();
  }

  getMyPlaces() {
    this.geolocation.getCurrentPosition().then((resp) => {
      this.lat = resp.coords.latitude;
      this.lng = resp.coords.longitude;
      var timestamp = resp.timestamp;
      var timestamptodate = new Date(timestamp)
      console.log('timestamp :', timestamp);
      console.log('timestamptodate :', timestamptodate);
      // this.loadMap();
      this.check_btn = this.lat;
      // alert(this.check_btn);
      this.loadMapGratis();
      console.log("getCurrentPosition Lat ", this.lat);
      console.log("getCurrentPosition lng ", this.lng);
    }).catch((error) => {
      console.log("Error getting location ", error);
    });

    // let watch = this.geolocation.watchPosition();
    // watch.subscribe((data) => {
    //   this.lat = data.coords.latitude;
    //   this.lng = data.coords.longitude;
    //   console.log("watchPosition Lat ", this.lat);
    //   console.log("watchPosition lng ", this.lng);
    //   this.loadMap();
    // });

  }

  // loadMap() {
  //   this.latLng = new google.maps.LatLng(this.lat, this.lng);
  //   let mapOptions = {
  //     center: this.latLng,
  //     zoom: 18,
  //     disableDefaultUI: true,
  //     enableHighAccuracy: true,
  //     mapTypeId: google.maps.MapTypeId.ROADMAP
  //   };
  //   this.map = new google.maps.Map(this.mapElement.nativeElement, mapOptions);
  //   this.addMarker(this.map);
  // }

  // addMarker(map: any) {
  //   new google.maps.Marker({ map: map, animation: google.maps.Animation.DROP, position: map.getCenter() });
  // }

  loadMapGratis() {
    const map = new Map('map').setView([this.lat, this.lng], 23);

    tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
    }).addTo(map);

    marker([this.lat, this.lng]).addTo(map)
      .bindPopup('Posisi Anda')
      .openPopup();
  }

  selectPosition(posisi) {
    this.posisi = posisi;
    console.log('Posisi : ', this.posisi);
  }

  getCheckIn() {

    const confirm = this.alertCtrl.create({
      title: 'Konfirmasi lokasi',
      message: 'Apakah Anda sudah benar di lokasi outlet terpilih?',
      buttons: [
        {
          text: 'Tidak',
          handler: () => {
            console.log('Disagree clicked');
          }
        },
        {
          text: 'Ya',
          handler: () => {
            console.log('Agree clicked');
            this.waktuin = this.date + " " + this.myTime.substring(11, 19);
            var checkin_temp = [
              {
                idcheckin: this.idcheckin,
                kdsalesman: this.kdsales,
                kdoutlet: this.kd_outlet,
                nama_outlet: this.nama_outlet,
                truelocation: this.posisi,
                latitude: this.lat,
                longitude: this.lng,
                waktuin: this.waktuin,
                kdcabang: this.kdcabang,
                tglcheckin: this.date,
                sendstatus: this.send_status
              }
            ];
            this.storage.set('checkin_temp', checkin_temp);
            this.navCtrl.push(CheckinPage);
            this.backgroundGeolocation.stop();
            this.checkGeolocation.unsubscribe();
            this.backgroundGeolocation.deleteAllLocations();
          }
        }
      ]
    });
    confirm.present();

  }


  async presentLoading() {
    this.loader = this.loadingCtrl.create(
      {
        content: "Tunggu sebentar.."
      });
    return await this.loader.present();
  }

  getPosition() {
    this.presentLoading();
    this.geolocation.getCurrentPosition().then((resp) => {
      this.lat = resp.coords.latitude;
      this.lng = resp.coords.longitude;
      if (this.lat) {
        this.loader.dismiss();
        this.getMyPlaces();
      }
    }).catch((error) => {
      console.log("Error getting location ", error);
    });

    // let watch = this.geolocation.watchPosition();
    // watch.subscribe((data) => {
    //   this.lat = data.coords.latitude;
    //   this.lng = data.coords.longitude;
    //   console.log("watchPosition Lat ", this.lat);
    //   console.log("watchPosition lng ", this.lng);
    //   this.loader.dismiss();
    //   this.loadMap();
    // });

  }

  getIdCheckIn() {
    this.storage.get("idcheckin").then((res) => {
      console.log("ID Check In dari local : ", res);
      var year_month = this.yearnow.substring(2, 4) + "" + this.yearnow.substring(5, 7);
      var id = res[0].idcheckin;
      var idstring = String(res[0].idcheckin)

      var year_month_prev = idstring.substring(6, 10);
      console.log(year_month_prev);

      // kalo yearnow sama monthnow ga sama, id check in bakal di reset
      if (id == 0) {
        this.idcheckin = this.kdcabang + this.iduser + year_month + "0001";
        console.log("ID Check In bakal jadi id baru : ", parseInt(this.idcheckin));
      } else if (parseInt(year_month_prev) != parseInt(year_month)) {
        console.log('Year Month ga sama')
        this.idcheckin = this.kdcabang + this.iduser + year_month + "0001";
        console.log("ID Check In bakal jadi id baru : ", parseInt(this.idcheckin));
      } else {
        this.idcheckin = parseInt(id) + 1;
        console.log("ID Check In yg udah ada, terus bakal jadi id check in: ", this.idcheckin);
      }
    });
  }


}
