import { Component } from '@angular/core';
import { AlertController, IonicPage, LoadingController, NavController, NavParams } from 'ionic-angular';
import { ScreenOrientation } from '@ionic-native/screen-orientation';
import { PostProvider } from '../../providers/post-provider';
import { StatusBar } from '@ionic-native/status-bar';



@IonicPage()
@Component({
  selector: 'page-otorisasihistory',
  templateUrl: 'otorisasihistory.html',
})
export class OtorisasihistoryPage {

  kdoutlet: any;
  kdcabang: any;
  namaoutlet: any;

  loader: any;

  historytransaction: any;
  historyfaktur: any;
  historyretur: any;
  giro: any;

  NoPiutang: any;
  TglFaktur: any;
  TglTransaksi: any;
  Tipe: any;
  Ket: any;
  Bayar: any;
  hari: any;

  NoTrans: any;
  TglTrans: any;
  TglJto: any;
  TotalPiutang: any;
  TotalBayar: any;
  Sisa: any;

  alertpesan: any;
  alertpesan2: any;
  alertpesan3: any;
  alertpesan4: any;

  historyfakturTotalPiutang: number;
  historyfakturTotalBayar: number;
  historyfakturSisa: number;

  historyReturTotalPiutang: number;
  historyReturTotalBayar: number;
  historyreturSisa: number;

  TotalFakturReturGiro: number;
  totalAll: number;


  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    private loadingCtrl: LoadingController,
    public postPvdr: PostProvider,
    public alertCtrl: AlertController,
    public statusBar: StatusBar,
    private screenOrientation: ScreenOrientation) {

    // get current
    console.log(this.screenOrientation.type); // logs the current orientation, example: 'landscape'
    // set to PORTRAIT
    // this.screenOrientation.lock(this.screenOrientation.ORIENTATIONS.LANDSCAPE);

    this.getCurrentData(navParams.get('kdoutlet'), navParams.get('kdcabang'), navParams.get('namaoutlet'));

  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad OtorisasihistoryPage');
  }

  ionViewDidEnter() {
    this.statusBar.backgroundColorByHexString("#000000");
    this.statusBar.styleLightContent();
  }

  getCurrentData(kdoutlet, kdcabang, namaoutlet) {
    this.kdoutlet = kdoutlet;
    this.kdcabang = kdcabang;
    this.namaoutlet = namaoutlet;
    this.getOtorisasiHistory(kdoutlet, kdcabang)
  }

  async presentLoading() {
    this.loader = await this.loadingCtrl.create({
      content: "Mohon tunggu..",
    });
    return await this.loader.present();
  }

  getOtorisasiHistory(kdoutlet, kdcabang) {

    let body = {
      kdcabang: kdcabang,
      kdoutlet: kdoutlet,
      aksi: 'get_history_otorisasi'
    };

    this.presentLoading();

    this.postPvdr.postData(body, 'Otorisasi').subscribe(data => {

      this.loader.dismiss();
      this.historytransaction = [];
      this.historyfaktur = [];
      this.historyretur = [];
      this.giro = [];

      if (data.success) {
        for (let i = 0; i < data.result.length; i++) {
          this.historytransaction.push(
            {
              'NoPiutang': data.result[i].NoPiutang,
              'TglFaktur': data.result[i].TglFaktur,
              'TglTransaksi': data.result[i].TglTransaksi,
              'Tipe': data.result[i].Tipe,
              'Ket': data.result[i].Ket,
              'Bayar': data.result[i].Bayar,
              'hari': data.result[i].hari
            }
          )
        }
      } else {
        // console.log(alertpesan);
        // const alert = this.alertCtrl.create({
        //   title: 'Info!!',
        //   subTitle: this.alertpesan,
        //   buttons: ['OK']
        // });
        // this.navCtrl.pop();  
        // alert.present();
        this.alertpesan = data.msg;
      }

      if (data.success2) {
        var a = 0;
        var b = 0;
        var c = 0;
        for (let j = 0; j < data.result2.length; j++) {

          //isi
          this.historyfaktur.push(
            {
              'NoTrans': data.result2[j].NoTrans,
              'TglTrans': data.result2[j].TglTrans,
              'TglJto': data.result2[j].TglJto,
              'TotalPiutang': data.result2[j].TotalPiutang,
              'TotalBayar': data.result2[j].TotalBayar,
              'Sisa': data.result2[j].Sisa
            }
          );

          //sum historyfakturTotalPiutang
          a += parseInt(data.result2[j].TotalPiutang1);
          b += parseInt(data.result2[j].TotalBayar1);
          c += parseInt(data.result2[j].Sisa1);
        }

        this.historyfakturTotalPiutang = a;
        this.historyfakturTotalBayar = b;
        this.historyfakturSisa = c;


      } else {
        // console.log(alertpesan2);
        // const alert = this.alertCtrl.create({
        //   title: 'Info!!',
        //   subTitle: this.alertpesan2,
        //   buttons: ['OK']
        // });

        // this.navCtrl.pop();  
        // alert.present();
        this.alertpesan2 = data.msg2;
        this.historyfakturTotalPiutang = 0;
        this.historyfakturTotalBayar = 0;
        this.historyfakturSisa = 0;
      }

      if (data.success3) {
        var d = 0;
        var e = 0;
        var f = 0;
        for (let k = 0; k < data.result3.length; k++) {
          this.historyretur.push(
            {
              'NoTrans': data.result3[k].NoTrans,
              'TglTrans': data.result3[k].TglTrans,
              'TglJto': data.result3[k].TglJto,
              'TotalPiutang': data.result3[k].TotalPiutang,
              'TotalBayar': data.result3[k].TotalBayar,
              'Sisa': data.result3[k].Sisa

            }
          );
          d += parseInt(data.result3[k].TotalPiutang1);
          e += parseInt(data.result3[k].TotalBayar1);
          f += parseInt(data.result3[k].Sisa1);
        }

        this.historyReturTotalPiutang = d;
        this.historyReturTotalBayar = e;
        this.historyreturSisa = f;



      } else {
        // console.log(alertpesan3);
        // const alert = this.alertCtrl.create({
        //   title: 'Info!!',
        //   subTitle: this.alertpesan3,
        //   buttons: ['OK']
        // });

        // this.navCtrl.pop();  
        // alert.present();

        this.alertpesan3 = data.msg3;
        this.historyReturTotalPiutang = 0;
        this.historyReturTotalBayar = 0;
        this.historyreturSisa = 0;
      }


      if (data.success4) {
        var g = 0;
        for (let l = 0; l < data.result4.length; l++) {
          this.giro.push(
            {
              'NoGiro': data.result4[l].NoGiro,
              'TglTerima': data.result4[l].TglTerima,
              'TglJTo': data.result4[l].TglJTo,
              'NilaiGiro': data.result4[l].NilaiGiro

            }
          );
          g += parseInt(data.result4[l].NilaiGiro1);
        }

        this.TotalFakturReturGiro = g;


      } else {
        // console.log(alertpesan3);
        // const alert = this.alertCtrl.create({
        //   title: 'Info!!',
        //   subTitle: this.alertpesan3,
        //   buttons: ['OK']
        // });

        // this.navCtrl.pop();  
        // alert.present();

        this.alertpesan4 = data.msg4;
        this.TotalFakturReturGiro = 0;
      }

      console.log('History Transaction : ', this.historytransaction);
      console.log('History Faktur : ', this.historyfaktur);
      console.log('History Retur : ', this.historyretur);
      console.log('History Giro : ', this.giro);

      this.totalAll = this.historyfakturSisa - this.historyreturSisa + this.TotalFakturReturGiro;
      // this.totalAll = c - f + g;  


    }, error => {

      this.loader.dismiss();

      const alert = this.alertCtrl.create({
        title: 'Warning!!',
        subTitle: 'Connection Failed',
        buttons: ['OK'],

      });

      alert.present();

    });

  }

}
