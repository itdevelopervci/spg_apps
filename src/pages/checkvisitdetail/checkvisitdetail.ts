import { Component, ElementRef, ViewChild } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { Map, tileLayer, marker } from "leaflet";

declare var google;


@IonicPage()
@Component({
  selector: 'page-checkvisitdetail',
  templateUrl: 'checkvisitdetail.html',
})
export class CheckvisitdetailPage {

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

  constructor(public navCtrl: NavController, public navParams: NavParams) {

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
    console.log('ionViewDidLoad CheckvisitdetailPage');
    // this.loadMap();
    this.loadMapGratis();
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

    console.log(this.idcheckin)
    console.log(this.kd_salesman)
    console.log(this.namasales)
    console.log(this.kd_outlet)
    console.log(this.nama_outlet)
    console.log(this.waktu_in)
    console.log(this.waktu_cin)
    console.log(this.waktu_cout)
    console.log(this.nama_tipe_cekin)
    console.log(this.truelocation)
    console.log(this.lat)
    console.log(this.lng)

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

  getBack() {
    this.navCtrl.pop();
  }

}
