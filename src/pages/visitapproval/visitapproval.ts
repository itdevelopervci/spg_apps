import { Component, ElementRef, ViewChild } from '@angular/core';
import { AlertController, IonicPage, LoadingController, ModalController, NavController, NavParams, ToastController } from 'ionic-angular';
import { Storage } from '@ionic/Storage';
import { PostProvider } from '../../providers/post-provider';
import { MapsviewerPage } from '../mapsviewer/mapsviewer';


@IonicPage()
@Component({
  selector: 'page-visitapproval',
  templateUrl: 'visitapproval.html',
})
export class VisitapprovalPage {

  @ViewChild('map') mapElement: ElementRef;
  map: any;

  kdcabang: any;
  kdgudang: any;
  datacheckin: any;
  checkin_list: any;
  details_pane: any;

  // idcheckin: any;
  // kd_salesman: any;
  // namasales: any;
  // kd_outlet: any;
  // nama_outlet: any;
  // waktu_in: any;
  // waktu_cin: any;
  // waktu_cout: any;
  // nama_tipe_cekin: any;
  // truelocation: any;
  // lng: any; //as lat
  // lat: any; //as lng

  loader: any;

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    private storage: Storage,
    public postPvdr: PostProvider,
    public loadingCtrl: LoadingController,
    public alertCtrl: AlertController,
    public toastCtrl: ToastController,
    public modalCtrl: ModalController
  ) {

    //  Code here

  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad VisitapprovalPage');
    this.loadData();
  }

  // ionViewDidEnter() {
  loadData() {
    this.storage.get('session_user_salesman').then((res) => {
      console.log(res);
      if (res !== null) {
        this.kdcabang = res[0].KdCabang;
        this.kdgudang = res[0].KdGudang;
        this.getDataServer(this.kdcabang, this.kdgudang);
      }
    });
  }

  async presentLoading(x) {
    this.loader = await this.loadingCtrl.create({
      content: x,
    });
    return await this.loader.present();
  }

  getDataServer(kdcabang, kdgudang) {
    let body = {
      kdcabang: kdcabang,
      kdgudang: kdgudang,
      aksi: 'get_checkin_nolocation',
    };
    this.presentLoading('Mohon tunggu');
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
          tgl_1 = data.result[i].TglCheckIn;
          if (tgl_1 != tgl_2) {
            tgl = tgl_1;
          } else {
            tgl = "";
          }
          this.checkin_list.push({
            'idcheckin': data.result[i].IdCekIn,
            'waktu_in': tgl,
            'kd_outlet': data.result[i].KdOutlet,
            'kd_salesman': data.result[i].KdSalesman,
            'username': data.result[i].UserName,
            'namasales': data.result[i].NamaSls,
            'nama_outlet': data.result[i].NamaOutlet,
            'truelocation': data.result[i].TrueLocation,
            'lat': data.result[i].Latitude,
            'lng': data.result[i].Longitude,
            'waktu_cin': data.result[i].WaktuIn,
            'waktu_cout': data.result[i].WaktuOut,
            'nama_tipe_cekin': data.result[i].NamaTipeCekin,
            'approve': data.result[i].Approve
          })
          tgl_2 = data.result[i].TglCheckIn;
        }
        // console.log('checkin_list : ', this.checkin_list);
      } else {
        this.loader.dismiss().catch();
        const toast = this.toastCtrl.create({
          message: 'Tidak ada kunjungan yang membutuhkan persetujuan.',
          duration: 2000,
          position: 'top'
        });
        toast.present();
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
              this.getDataServer(kdcabang, kdgudang);
            }
          }
        ]
      });
      confirm.present();
    });

  }

  showDetails(idcheckin, kd_salesman, namasales, kd_outlet, nama_outlet, waktu_in, waktu_cin, waktu_cout, nama_tipe_cekin, truelocation, lat, lng) {
    this.navCtrl.push(MapsviewerPage, {
      idcheckin: idcheckin,
      kd_salesman: kd_salesman,
      namasales: namasales,
      kd_outlet: kd_outlet,
      nama_outlet: nama_outlet,
      waktu_in: waktu_in,
      waktu_cin: waktu_cin,
      waktu_cout: waktu_cout,
      nama_tipe_cekin: nama_tipe_cekin,
      truelocation: truelocation,
      lat: lat,
      lng: lng
    });

    // this.idcheckin = idcheckin;
    // this.kd_salesman = kd_salesman;
    // this.namasales = namasales;
    // this.kd_outlet = kd_outlet;
    // this.nama_outlet = nama_outlet;
    // this.waktu_in = waktu_in;
    // this.waktu_cin = waktu_cin;
    // this.waktu_cout = waktu_cout;
    // this.nama_tipe_cekin = nama_tipe_cekin;
    // this.truelocation = truelocation;
    // this.lat = lng;
    // this.lng = lat;
  }

  doRefresh(refresher) {
    this.storage.get('session_user_salesman').then((res) => {
      if (res !== null) {
        console.log('data user: ', res);
        this.kdcabang = res[0].KdCabang;
        this.kdgudang = res[0].KdGudang;
        this.getDataServer(this.kdcabang, this.kdgudang);
      }
    });

    setTimeout(() => {
      refresher.complete();
    }, 2000);
  }

}
