import { Component, ViewChild } from '@angular/core';
import { AlertController, Content, IonicPage, LoadingController, ModalController, NavController, NavParams, ToastController } from 'ionic-angular';
import { Storage } from '@ionic/Storage';
import { PostProvider } from '../../providers/post-provider';
import { CheckvisitdetailPage } from '../checkvisitdetail/checkvisitdetail';



@IonicPage()
@Component({
  selector: 'page-checkvisit',
  templateUrl: 'checkvisit.html',
})
export class CheckvisitPage {

  @ViewChild(Content) content: Content;

  kdcabang: any;
  kdgudang: any;
  tipeuser: any;
  username: any;

  datacheckin: any;
  checkin_list: any;
  loader: any;

  // regional: string = "regbar";
  regional: any;
  // cabang: string = "jk1";
  cabang: any;

  myDate: String = new Date().toISOString();
  kdcabang2: any;
  buttonDisabled1: any;
  buttonDisabled2: any;
  buttonDisabled3: any;
  buttonDisabled4: any;
  buttonDisabled5: any;
  buttonDisabled6: any;

  regbarDisabled: any;
  regtimDisabled: any;

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

    this.storage.get('session_user_salesman').then((res) => {
      if (res !== null) {
        this.kdcabang = res[0].KdCabang;
        this.kdgudang = res[0].KdGudang;
        this.tipeuser = res[0].KodeTipeUser;
        this.username = res[0].UserName;
        console.log(this.kdcabang)
        console.log(this.kdgudang)
        console.log(this.tipeuser)
        console.log(this.username)
        if (this.tipeuser == 'RM0001') {
          document.getElementById('regbar').style.display = '';
          document.getElementById('regtim').style.display = 'none';
          // this.getDataServer('31');
          this.getDataServer(31, this.kdgudang, this.myDate.substring(0, 10), this.tipeuser, this.username);
          this.regional = 'regbar';
          this.cabang = 'jk1';
          this.kdcabang2 = 31;
        } else if (this.tipeuser == 'RM0002') {
          document.getElementById('regbar').style.display = 'none';
          document.getElementById('regtim').style.display = '';
          // this.getDataServerRegtim('41');
          this.getDataServerRegtim(41, this.kdgudang, this.myDate.substring(0, 10), this.tipeuser, this.username);
          this.regional = 'regtim';
          this.cabang = 'sby';
          this.kdcabang2 = 41;
        } else if (this.tipeuser == 'SPV001') {
          if (this.kdcabang == '31') {
            document.getElementById('regbar').style.display = '';
            document.getElementById('regtim').style.display = 'none';
            this.regbarDisabled = true;
            this.buttonDisabled1 = false;
            this.buttonDisabled2 = true;
            this.buttonDisabled3 = true;
            this.regional = 'regbar';
            this.cabang = 'jk1';
            this.kdcabang2 = 31;
            this.getDataServer(this.kdcabang, this.kdgudang, this.myDate.substring(0, 10), this.tipeuser, this.username);
          } else if (this.kdcabang == '32') {
            document.getElementById('regbar').style.display = '';
            document.getElementById('regtim').style.display = 'none';
            this.regbarDisabled = true;
            this.buttonDisabled1 = true;
            this.buttonDisabled2 = false;
            this.buttonDisabled3 = true;
            this.regional = 'regbar';
            this.cabang = 'jk2';
            this.kdcabang2 = 32;
            this.getDataServer(this.kdcabang, this.kdgudang, this.myDate.substring(0, 10), this.tipeuser, this.username);
          } else if (this.kdcabang == '33') {
            document.getElementById('regbar').style.display = '';
            document.getElementById('regtim').style.display = 'none';
            this.regbarDisabled = true;
            this.buttonDisabled1 = true;
            this.buttonDisabled2 = true;
            this.buttonDisabled3 = false;
            this.regional = 'regbar';
            this.cabang = 'bdg';
            this.kdcabang2 = 33;
            this.getDataServer(this.kdcabang, this.kdgudang, this.myDate.substring(0, 10), this.tipeuser, this.username);
          } else if (this.kdcabang == '41') {
            document.getElementById('regbar').style.display = 'none';
            document.getElementById('regtim').style.display = '';
            this.regtimDisabled = true;
            this.buttonDisabled4 = false;
            this.buttonDisabled5 = true;
            this.buttonDisabled6 = true;
            this.regional = 'regtim';
            this.cabang = 'sby';
            this.kdcabang2 = 41;
            this.getDataServer(this.kdcabang, this.kdgudang, this.myDate.substring(0, 10), this.tipeuser, this.username);
          } else if (this.kdcabang == '42') {
            document.getElementById('regbar').style.display = 'none';
            document.getElementById('regtim').style.display = '';
            this.regtimDisabled = true;
            this.buttonDisabled4 = true;
            this.buttonDisabled5 = false;
            this.buttonDisabled6 = true;
            this.regional = 'regtim';
            this.cabang = 'smg';
            this.kdcabang2 = 42;
            this.getDataServer(this.kdcabang, this.kdgudang, this.myDate.substring(0, 10), this.tipeuser, this.username);
          } else if (this.kdcabang == '43') {
            document.getElementById('regbar').style.display = 'none';
            document.getElementById('regtim').style.display = '';
            this.regtimDisabled = true;
            this.buttonDisabled4 = true;
            this.buttonDisabled5 = true;
            this.buttonDisabled6 = false;
            this.regional = 'regtim';
            this.cabang = 'dps';
            this.kdcabang2 = 43;
            this.getDataServer(this.kdcabang, this.kdgudang, this.myDate.substring(0, 10), this.tipeuser, this.username);
          }
        } else if (this.tipeuser == 'SC0001') {
          if (this.kdcabang == '31') {
            document.getElementById('regbar').style.display = '';
            document.getElementById('regtim').style.display = 'none';
            this.regbarDisabled = true;
            this.buttonDisabled1 = false;
            this.buttonDisabled2 = true;
            this.buttonDisabled3 = true;
            this.regional = 'regbar';
            this.cabang = 'jk1';
            this.kdcabang2 = 31;
            this.getDataServer(this.kdcabang, this.kdgudang, this.myDate.substring(0, 10), this.tipeuser, this.username);
          } else if (this.kdcabang == '32') {
            document.getElementById('regbar').style.display = '';
            document.getElementById('regtim').style.display = 'none';
            this.regbarDisabled = true;
            this.buttonDisabled1 = true;
            this.buttonDisabled2 = false;
            this.buttonDisabled3 = true;
            this.regional = 'regbar';
            this.cabang = 'jk2';
            this.kdcabang2 = 32;
            this.getDataServer(this.kdcabang, this.kdgudang, this.myDate.substring(0, 10), this.tipeuser, this.username);
          } else if (this.kdcabang == '33') {
            document.getElementById('regbar').style.display = '';
            document.getElementById('regtim').style.display = 'none';
            this.regbarDisabled = true;
            this.buttonDisabled1 = true;
            this.buttonDisabled2 = true;
            this.buttonDisabled3 = false;
            this.regional = 'regbar';
            this.cabang = 'bdg';
            this.kdcabang2 = 33;
            this.getDataServer(this.kdcabang, this.kdgudang, this.myDate.substring(0, 10), this.tipeuser, this.username);
          } else if (this.kdcabang == '41') {
            document.getElementById('regbar').style.display = 'none';
            document.getElementById('regtim').style.display = '';
            this.regtimDisabled = true;
            this.buttonDisabled4 = false;
            this.buttonDisabled5 = true;
            this.buttonDisabled6 = true;
            this.regional = 'regtim';
            this.cabang = 'sby';
            this.kdcabang2 = 41;
            this.getDataServer(this.kdcabang, this.kdgudang, this.myDate.substring(0, 10), this.tipeuser, this.username);
          } else if (this.kdcabang == '42') {
            document.getElementById('regbar').style.display = 'none';
            document.getElementById('regtim').style.display = '';
            this.regtimDisabled = true;
            this.buttonDisabled4 = true;
            this.buttonDisabled5 = false;
            this.buttonDisabled6 = true;
            this.regional = 'regtim';
            this.cabang = 'smg';
            this.kdcabang2 = 42;
            this.getDataServer(this.kdcabang, this.kdgudang, this.myDate.substring(0, 10), this.tipeuser, this.username);
          } else if (this.kdcabang == '43') {
            document.getElementById('regbar').style.display = 'none';
            document.getElementById('regtim').style.display = '';
            this.regtimDisabled = true;
            this.buttonDisabled4 = true;
            this.buttonDisabled5 = true;
            this.buttonDisabled6 = false;
            this.regional = 'regtim';
            this.cabang = 'dps';
            this.kdcabang2 = 43;
            this.getDataServer(this.kdcabang, this.kdgudang, this.myDate.substring(0, 10), this.tipeuser, this.username);
          }
        } else {
          this.getDataServer(31, this.kdgudang, this.myDate.substring(0, 10), this.tipeuser, this.username);
          this.regional = 'regbar';
          this.cabang = 'jk1';
          this.kdcabang2 = 31;
        }
      }
    });

  }

  scrollTop() {
    this.content.scrollToTop(0);
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad CheckvisitPage');
  }

  // ionViewDidEnter() {
  //   this.storage.get('session_user_salesman').then((res) => {
  //     if (res !== null) {
  //       this.kdcabang = res[0].KdCabang;
  //       this.kdgudang = res[0].KdGudang;
  //       this.getDataServer(this.kdcabang, this.kdgudang);
  //     }
  //   });
  // }

  // ionViewDidEnter() {
  //   if (this.tipeuser == 'RM0001') {
  //     document.getElementById('regbar').style.display = '';
  //     document.getElementById('regtim').style.display = 'none';
  //     // this.getDataTransRegbar(31);
  //     this.getDataServer('31');
  //     this.regional = 'regbar';
  //     this.cabang = 'jk1';
  //   } else if (this.tipeuser == 'RM0002') {
  //     document.getElementById('regbar').style.display = 'none';
  //     document.getElementById('regtim').style.display = '';
  //     // this.getDataTransRegtim(41);
  //     this.getDataServerRegtim('41');
  //     this.regional = 'regtim';
  //     this.cabang = 'sby';
  //   } else {
  //     // this.getDataTransRegbar(31);
  //     this.getDataServer('31');
  //     this.regional = 'regbar';
  //     this.cabang = 'jk1';
  //   }
  // }

  // refreshData() {
  //   this.storage.get('session_user_salesman').then((res) => {
  //     if (res !== null) {
  //       this.kdcabang = res[0].KdCabang;
  //       this.kdgudang = res[0].KdGudang;
  //       this.getDataServer(this.kdcabang, this.kdgudang);
  //     }
  //   });
  // }

  // doRefresh(refresher) {
  //   this.storage.get('session_user_salesman').then((res) => {
  //     if (res !== null) {
  //       this.kdcabang = res[0].KdCabang;
  //       this.kdgudang = res[0].KdGudang;
  //       this.getDataServer(this.kdcabang, this.kdgudang);
  //     }
  //   });

  //   setTimeout(() => {
  //     refresher.complete();
  //   }, 2000);
  // }

  selectDate() {
    this.myDate = this.myDate.substring(0, 10);
    console.log('Date is Regbar : ', this.myDate);
    this.getDataServer(this.kdcabang2, this.kdgudang, this.myDate, this.tipeuser, this.username);
  }

  selectDate2() {
    this.myDate = this.myDate.substring(0, 10);
    console.log('Date is Regtim : ', this.myDate);
    this.getDataServerRegtim(this.kdcabang2, this.kdgudang, this.myDate, this.tipeuser, this.username);
  }

  async presentLoading(x) {
    this.loader = await this.loadingCtrl.create({
      content: x,
    });
    return await this.loader.present();
  }

  selectRegional1(cbg) {
    this.cabang = cbg;
    console.log('Pilih regional : ', cbg)
    // this.getDataServer(31);
    this.kdcabang2 = 31;
    this.getDataServer(31, this.kdgudang, this.myDate.substring(0, 10), this.tipeuser, this.username);
    this.scrollTop();
    document.getElementById('cab_regbar').style.display = '';
    document.getElementById('cab_regtim').style.display = 'none';
  }

  selectRegional2(cbg) {
    this.cabang = cbg;
    console.log('Pilih regional : ', cbg)
    // this.getDataServerRegtim(41);
    this.kdcabang2 = 41;
    this.getDataServerRegtim(41, this.kdgudang, this.myDate.substring(0, 10), this.tipeuser, this.username);
    this.scrollTop();
    document.getElementById('cab_regbar').style.display = 'none';
    document.getElementById('cab_regtim').style.display = '';
  }

  showTrans1(kdcabang) {
    this.kdcabang2 = kdcabang;
    console.log('kdabang : ', kdcabang)
    // this.getDataServer(kdcabang);
    this.getDataServer(kdcabang, this.kdgudang, this.myDate.substring(0, 10), this.tipeuser, this.username);
    this.scrollTop();
  }

  showTrans2(kdcabang) {
    this.kdcabang2 = kdcabang;
    console.log('kdabang : ', kdcabang)
    // this.getDataServerRegtim(kdcabang)
    this.getDataServerRegtim(kdcabang, this.kdgudang, this.myDate.substring(0, 10), this.tipeuser, this.username);
    this.scrollTop();
  }

  getDataServer(kdcabang, kdgudang, tanggal, tipe, username) {
    let body = {
      kdcabang: kdcabang,
      kdgudang: kdgudang,
      tanggal: tanggal,
      tipe: tipe,
      username: username,
      aksi: 'get_checkin_sales',
    };
    console.log(body);
    this.presentLoading('Mohon tunggu');
    this.postPvdr.postData(body, 'Checkin').subscribe((data) => {
      // var alertmsg = data.msg;
      if (data.success) {
        document.getElementById('data_empty').style.display = 'none';
        document.getElementById('data_not_empty').style.display = '';
        this.scrollTop();
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
            'namadepo': data.result[i].NamaDepo,
            'nama_outlet': data.result[i].NamaOutlet,
            'truelocation': data.result[i].TrueLocation,
            'lat': data.result[i].Latitude,
            'lng': data.result[i].Longitude,
            'waktu_cin': data.result[i].WaktuIn,
            'waktu_cout': data.result[i].WaktuOut,
            'nama_tipe_cekin': data.result[i].NamaTipeCekin
          })
          tgl_2 = data.result[i].TglCheckIn;
        }
        // console.log('checkin_list : ', this.checkin_list);
      } else {
        document.getElementById('data_not_empty').style.display = 'none';
        document.getElementById('data_empty').style.display = '';
        this.loader.dismiss().catch();
        const toast = this.toastCtrl.create({
          message: 'Tidak ada kunjungan',
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
              // this.getDataServer(kdcabang, kdgudang);
              // this.getDataServer(kdcabang);
              this.getDataServer(kdcabang, kdcabang, tanggal, tipe, username);
            }
          }
        ]
      });
      confirm.present();
    });

  }

  getDataServerRegtim(kdcabang, kdgudang, tanggal, tipe, username) {
    let body = {
      kdcabang: kdcabang,
      kdgudang: kdgudang,
      tanggal: tanggal,
      tipe: tipe,
      username: username,
      aksi: 'get_checkin_sales',
    };
    this.presentLoading('Mohon tunggu');
    this.postPvdr.postDataRegtim(body, 'Checkin').subscribe((data) => {
      // var alertmsg = data.msg;
      if (data.success) {
        document.getElementById('data_empty').style.display = 'none';
        document.getElementById('data_not_empty').style.display = '';
        this.scrollTop();
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
            'namadepo': data.result[i].NamaDepo,
            'nama_outlet': data.result[i].NamaOutlet,
            'truelocation': data.result[i].TrueLocation,
            'lat': data.result[i].Latitude,
            'lng': data.result[i].Longitude,
            'waktu_cin': data.result[i].WaktuIn,
            'waktu_cout': data.result[i].WaktuOut,
            'nama_tipe_cekin': data.result[i].NamaTipeCekin
          })
          tgl_2 = data.result[i].TglCheckIn;
        }
        // console.log('checkin_list : ', this.checkin_list);
      } else {
        document.getElementById('data_not_empty').style.display = 'none';
        document.getElementById('data_empty').style.display = '';
        this.loader.dismiss().catch();
        const toast = this.toastCtrl.create({
          message: 'Tidak ada kunjungan.',
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
              // this.getDataServer(kdcabang, kdgudang);
              // this.getDataServerRegtim(kdcabang);
              this.getDataServer(kdcabang, kdcabang, tanggal, tipe, username);
            }
          }
        ]
      });
      confirm.present();
    });

  }

  // showDetails(idcheckin, kd_salesman, namasales, kd_outlet, nama_outlet, waktu_in, waktu_cin, waktu_cout, nama_tipe_cekin, truelocation, lat, lng) {
  //   this.navCtrl.push(CheckvisitdetailPage, {
  //     idcheckin: idcheckin,
  //     kd_salesman: kd_salesman,
  //     namasales: namasales,
  //     kd_outlet: kd_outlet,
  //     nama_outlet: nama_outlet,
  //     waktu_in: waktu_in,
  //     waktu_cin: waktu_cin,
  //     waktu_cout: waktu_cout,
  //     nama_tipe_cekin: nama_tipe_cekin,
  //     truelocation: truelocation,
  //     lat: lat,
  //     lng: lng
  //   });
  // }

  showDetails(idcheckin, kd_salesman, namasales, kd_outlet, nama_outlet, waktu_in, waktu_cin, waktu_cout, nama_tipe_cekin, truelocation, lat, lng) {
    this.navCtrl.push(CheckvisitdetailPage, {
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
  }




}
