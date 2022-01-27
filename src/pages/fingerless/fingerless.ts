import { Component, ViewChild, ElementRef } from '@angular/core';
import { IonicPage, NavController, NavParams, ToastController } from 'ionic-angular';
import { BarcodeScanner } from '@ionic-native/barcode-scanner/';
import { Geolocation } from '@ionic-native/geolocation';

declare var google;


@IonicPage()
@Component({
  selector: 'page-fingerless',
  templateUrl: 'fingerless.html',
})
export class FingerlessPage {

  @ViewChild('map') mapElement: ElementRef;
  map: any;

  scannedCode = null;
  distance = null;

  lat: any;
  lng: any;

  latLng: any;
  radius: Number = 70;


  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    private barcodeScanner: BarcodeScanner,
    public toastCtrl: ToastController,
    private geolocation: Geolocation
  ) {


  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad FingerlessPage');
  }

  ionViewDidEnter() {
    this.getMyPlaces();
  }

  getScanQR() {
    this.barcodeScanner.scan().then(barcodeData => {
      this.scannedCode = barcodeData.text;
      this.showToast();
    }).catch(err => {
      console.log('Error', err);
    });
  }

  showToast() {
    const toast = this.toastCtrl.create({
      message: this.scannedCode,
      position: 'bottom',
      showCloseButton: true,
      closeButtonText: 'Ok'
    });
    toast.present();
  }

  getMyPlaces() {
    this.geolocation.getCurrentPosition().then((resp) => {

      this.lat = resp.coords.latitude
      this.lng = resp.coords.longitude
      console.log('Lat ', this.lat);
      console.log('Lng ', this.lng);

      this.loadMap();
      this.getDistance();

    }).catch((error) => {
      console.log('Error getting location ', error)
    })

  }

  addMarker(map: any) {

    new google.maps.Marker({
      map: map,
      animation: google.maps.Animation.DROP,
      position: map.getCenter()
    });

  }

  loadMap() {

    // this.geolocation.getCurrentPosition().then((position) => {

    // get location
    // this.latLng = new google.maps.LatLng(position.coords.latitude, position.coords.longitude);
    this.latLng = new google.maps.LatLng(this.lat, this.lng);

    let mapOptions = {
      center: this.latLng,
      zoom: 16,
      disableDefaultUI: true,
      mapTypeId: google.maps.MapTypeId.ROADMAP
    }

    this.map = new google.maps.Map(this.mapElement.nativeElement, mapOptions);
    this.addMarker(this.map);
    this.addBorder();

    // }, (err) => {
    //   console.log(err);
    // });

  }

  addBorder() {
    // border HO PIFT
    var latLng_ = new google.maps.LatLng(-6.188190, 106.736726);
    var PIFT_Circle = {
      strokeColor: "#FFF",
      strokeOpacity: 0.8,
      strokeWeight: 0,
      fillColor: "#FF6600",
      fillOpacity: 0.3,
      map: this.map,
      center: latLng_,
      radius: this.radius // in meters
    };
    this.map = new google.maps.Circle(PIFT_Circle);

  }

  getDistance() {
    // this.geolocation.getCurrentPosition().then((position) => {
    var distanceInMeters = google.maps.geometry.spherical.computeDistanceBetween(
      new google.maps.LatLng({
        lat: this.lat,
        lng: this.lng
      }),
      new google.maps.LatLng({
        lat: -6.188190,
        lng: 106.736726
      })
    );
    this.distance = parseInt(distanceInMeters)
    console.log("Distance in Meters: ", this.distance);
    if (parseInt(this.distance) > this.radius) {
      const toast = this.toastCtrl.create({
        message: 'Your Distance is ' + this.distance + ' Meters',
        position: 'bottom',
        showCloseButton: true,
        closeButtonText: 'Ok'
      });
      toast.present();
    } else {
      const toast = this.toastCtrl.create({
        message: 'Your Distance is ' + this.distance + ' Meters',
        position: 'bottom',
        showCloseButton: true,
        closeButtonText: 'Ok'
      });
      toast.present();
    }

    // }, (err) => {
    //   console.log(err);
    // });
  }

  // addInfoWindow(marker, content) {

  //   let infoWindow = new google.maps.InfoWindow({
  //     content: content
  //   });

  //   google.maps.event.addListener(marker, 'click', () => {
  //     infoWindow.open(this.map, marker);
  //   });

  // }






}
