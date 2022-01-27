import { Component, ElementRef, ViewChild } from '@angular/core';
import { AlertController, IonicPage, NavController, NavParams, ToastController } from 'ionic-angular';
import { Storage } from '@ionic/Storage';
import { Map, tileLayer, marker } from "leaflet";

declare var google;

@IonicPage()
@Component({
  selector: 'page-mapsviewer',
  templateUrl: 'mapsviewer.html',
})
export class MapsviewerPage {

  @ViewChild('map') mapElement: ElementRef;
  map: any;

  idcheckin: any;
  kd_salesman: any;
  namasales: any;
  kd_outlet: any;
  nama_outlet: any;
  waktu_in: any;
  waktu_cin: any;
  waktu_cout: any;
  nama_tipe_cekin: any;
  truelocation: any;
  lng: any; //as lat
  lat: any; //as lng

  kdcabang: any;
  kdgudang: any;
  username: any;

  constructor(
    public navCtrl: NavController,
    public alertCtrl: AlertController,
    public toastCtrl: ToastController,
    private storage: Storage,
    public navParams: NavParams) {

    this.getCurrentData(
      navParams.get('idcheckin'),
      navParams.get('kd_salesman'),
      navParams.get('namasales'),
      navParams.get('kd_outlet'),
      navParams.get('nama_outlet'),
      navParams.get('waktu_in'),
      navParams.get('waktu_cin'),
      navParams.get('waktu_cout'),
      navParams.get('nama_tipe_cekin'),
      navParams.get('truelocation'),
      navParams.get('lat'),
      navParams.get('lng')
    );

  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad MapsviewerPage');
    // this.loadMap();
    this.loadMapGratis();

  }

  ionViewDidEnter() {
    // code here
    this.storage.get('session_user_salesman').then((res) => {
      if (res !== null) {
        this.username = res[0].UserName;
        this.kdcabang = res[0].KdCabang;
        this.kdgudang = res[0].KdGudang;
        console.log('username: ', this.username);
        console.log('kdgudang: ', this.kdgudang);
        console.log('kdcabang: ', this.kdcabang);
      }
    });
  }

  getCurrentData(idcheckin, kd_salesman, namasales, kd_outlet, nama_outlet, waktu_in, waktu_cin, waktu_cout, nama_tipe_cekin, truelocation, lat, lng) {
    this.idcheckin = idcheckin;
    this.kd_salesman = kd_salesman;
    this.namasales = namasales;
    this.kd_outlet = kd_outlet;
    this.nama_outlet = nama_outlet;
    this.waktu_in = waktu_in;
    this.waktu_cin = waktu_cin;
    this.waktu_cout = waktu_cout;
    this.nama_tipe_cekin = nama_tipe_cekin;
    this.truelocation = truelocation;
    this.lat = lng;
    this.lng = lat;
  }

  loadMap() {
    let latLng = new google.maps.LatLng(this.lat, this.lng);
    let mapOptions = {
      center: latLng,
      zoom: 18,
      disableDefaultUI: true,
      draggable: true,
      zoomControl: true,
      scrollwheel: false,
      disableDoubleClickZoom: true,
      mapTypeId: google.maps.MapTypeId.ROADMAP
    }
    this.map = new google.maps.Map(this.mapElement.nativeElement, mapOptions);
    this.addMarker(this.map);
  }

  addMarker(map: any) {
    new google.maps.Marker({ map: map, animation: google.maps.Animation.DROP, position: map.getCenter() });
  }

  loadMapGratis() {
    const map = new Map('map').setView([this.lat, this.lng], 23);

    tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
    }).addTo(map);

    // marker([this.lat, this.lng]).addTo(map).bindPopup('Posisi Anda').openPopup();
    marker([this.lat, this.lng]).addTo(map);
  }

  showConfirmToApprove(idcheckin) {
    const confirm = this.alertCtrl.create({
      title: 'Approval',
      message: 'Apakah anda ingin memberikan approval pada kunjungan ini?',
      buttons: [
        {
          text: 'Batal',
          handler: () => {
            // console.log('Disagree clicked');
          }
        },
        {
          text: 'Approve',
          handler: () => {
            console.log('id check in : ', idcheckin);
          }
        }
      ]
    });
    confirm.present();
  }

  showConfirmToReject() {
    const confirm = this.alertCtrl.create({
      title: 'Reject',
      message: 'Apakah anda tidak ingin memberikan approval pada kunjungan ini?',
      buttons: [
        {
          text: 'Batal',
          handler: () => {
            // console.log('Disagree clicked');
          }
        },
        {
          text: 'Reject',
          handler: () => {
            // console.log('Agree clicked');
          }
        }
      ]
    });
    confirm.present();
  }

  getBack() {
    this.navCtrl.pop();
  }

  underDevelopment() {
    const toast = this.toastCtrl.create({
      message: 'Menu ini masih dalam tahap pengembangan',
      duration: 3000
    });
    toast.present();
  }



}
