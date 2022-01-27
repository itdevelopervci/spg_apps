import { Component, ViewChild } from '@angular/core';
import { AlertController, Content, IonicPage, LoadingController, NavController, NavParams, ToastController } from 'ionic-angular';
import { PostProvider } from '../../providers/post-provider';



@IonicPage()
@Component({
  selector: 'page-checkrecaptrans',
  templateUrl: 'checkrecaptrans.html',
})
export class CheckrecaptransPage {

  @ViewChild(Content) content: Content;

  kdcabang: any;
  kdgudang: any;
  username: any;
  tipeuser: any;

  loader: any;
  trans_recap_monthly_list: any;

  buttonDisabled1: any;
  buttonDisabled2: any;
  buttonDisabled3: any;
  buttonDisabled4: any;
  buttonDisabled5: any;
  buttonDisabled6: any;

  regbarDisabled: any;
  regtimDisabled: any;

  myDate: String = new Date().toISOString();

  // regional: string = "regbar";
  regional: any;
  // cabang: string = "jk1";
  cabang: any;

  constructor(
    public navCtrl: NavController,
    public postPvdr: PostProvider,
    public alertCtrl: AlertController,
    public toastCtrl: ToastController,
    public loadingCtrl: LoadingController,
    public navParams: NavParams) {

    this.getCurrentData(
      navParams.get('kdcabang'),
      navParams.get('kdgudang'),
      navParams.get('username'),
      navParams.get('tipeuser')
    );

  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad CheckrecaptransPage');
  }

  getCurrentData(kdcabang, kdgudang, username, tipeuser) {
    this.kdcabang = kdcabang;
    this.kdgudang = kdgudang;
    this.username = username;
    this.tipeuser = tipeuser;
    console.log(this.kdcabang);
    console.log(this.kdgudang);
    console.log(this.username);
    console.log(this.tipeuser);
    if (this.tipeuser == 'SC0001') {
      if (this.kdcabang == '31') {
        this.buttonDisabled1 = false;
        this.buttonDisabled2 = true;
        this.buttonDisabled3 = true;
        this.regbarDisabled = true;
        this.regtimDisabled = true;
        this.regional = 'regbar';
        this.cabang = 'jk1';
        this.getDataTransRecapMonthly(kdcabang, kdgudang, username, tipeuser);
      } else if (this.kdcabang == '32') {
        this.buttonDisabled1 = true;
        this.buttonDisabled2 = false;
        this.buttonDisabled3 = true;
        this.regbarDisabled = true;
        this.regtimDisabled = true;
        this.regional = 'regbar';
        this.cabang = 'jk2';
        this.getDataTransRecapMonthly(kdcabang, kdgudang, username, tipeuser);
      } else if (this.kdcabang == '33') {
        this.buttonDisabled1 = true;
        this.buttonDisabled2 = true;
        this.buttonDisabled3 = false;
        this.regbarDisabled = true;
        this.regtimDisabled = true;
        this.regional = 'regbar';
        this.cabang = 'bdg';
        this.getDataTransRecapMonthly(kdcabang, kdgudang, username, tipeuser);
      } else if (this.kdcabang == '41') {
        this.buttonDisabled4 = false;
        this.buttonDisabled5 = true;
        this.buttonDisabled6 = true;
        this.regbarDisabled = true;
        this.regtimDisabled = true;
        this.regional = 'regtim';
        this.cabang = 'sby';
        this.getDataTransRecapMonthly(kdcabang, kdgudang, username, tipeuser);
      } else if (this.kdcabang == '42') {
        this.buttonDisabled4 = true;
        this.buttonDisabled5 = false;
        this.buttonDisabled6 = true;
        this.regbarDisabled = true;
        this.regtimDisabled = true;
        this.regional = 'regtim';
        this.cabang = 'smg';
        this.getDataTransRecapMonthly2(kdcabang, kdgudang, username, tipeuser);
      } else if (this.kdcabang == '43') {
        this.buttonDisabled4 = true;
        this.buttonDisabled5 = true;
        this.buttonDisabled6 = false;
        this.regbarDisabled = true;
        this.regtimDisabled = true;
        this.regional = 'regtim';
        this.cabang = 'dps';
        this.getDataTransRecapMonthly2(kdcabang, kdgudang, username, tipeuser);
      }
    } else if (this.tipeuser == 'SPV001') {
      if (this.kdcabang == '31') {
        this.buttonDisabled1 = false;
        this.buttonDisabled2 = true;
        this.buttonDisabled3 = true;
        this.regbarDisabled = false;
        this.regtimDisabled = true;
        this.regional = 'regbar';
        this.cabang = 'jk1';
        this.getDataTransRecapMonthly(kdcabang, kdgudang, username, tipeuser);
      } else if (this.kdcabang == '32') {
        this.buttonDisabled1 = true;
        this.buttonDisabled2 = false;
        this.buttonDisabled3 = true;
        this.regbarDisabled = false;
        this.regtimDisabled = true;
        this.regional = 'regbar';
        this.cabang = 'jk2';
        this.getDataTransRecapMonthly(kdcabang, kdgudang, username, tipeuser);
      } else if (this.kdcabang == '33') {
        this.buttonDisabled1 = true;
        this.buttonDisabled2 = true;
        this.buttonDisabled3 = false;
        this.regbarDisabled = false;
        this.regtimDisabled = true;
        this.regional = 'regbar';
        this.cabang = 'bdg';
        this.getDataTransRecapMonthly(kdcabang, kdgudang, username, tipeuser);
      } else if (this.kdcabang == '41') {
        this.buttonDisabled4 = false;
        this.buttonDisabled5 = true;
        this.buttonDisabled6 = true;
        this.regbarDisabled = true;
        this.regtimDisabled = false;
        this.regional = 'regtim';
        this.cabang = 'sby';
        this.getDataTransRecapMonthly(kdcabang, kdgudang, username, tipeuser);
      } else if (this.kdcabang == '42') {
        this.buttonDisabled4 = true;
        this.buttonDisabled5 = false;
        this.buttonDisabled6 = true;
        this.regbarDisabled = true;
        this.regtimDisabled = false;
        this.regional = 'regtim';
        this.cabang = 'smg';
        this.getDataTransRecapMonthly2(kdcabang, kdgudang, username, tipeuser);
      } else if (this.kdcabang == '43') {
        this.buttonDisabled4 = true;
        this.buttonDisabled5 = true;
        this.buttonDisabled6 = false;
        this.regbarDisabled = true;
        this.regtimDisabled = false;
        this.regional = 'regtim';
        this.cabang = 'dps';
        this.getDataTransRecapMonthly2(kdcabang, kdgudang, username, tipeuser);
      }
    } else {
      this.regional = 'regbar';
      this.cabang = 'jk1';
      this.getDataTransRecapMonthly(31, kdgudang, username, tipeuser);
    }
  }

  async presentLoading() {
    this.loader = await this.loadingCtrl.create({
      content: "",
      // duration: 2000
    });
    return await this.loader.present();
  }

  scrollTop() {
    this.content.scrollToTop(0);
  }

  selectRegional1(cbg) {
    this.cabang = cbg;
    console.log('Pilih regional : ', cbg)
    // this.getDataTransRegbar(31, this.kdgudang, this.username, this.tipeuser, this.myDate.substring(0, 10));
    this.scrollTop();
    this.getDataTransRecapMonthly(31, this.kdgudang, this.username, this.tipeuser);
  }

  selectRegional2(cbg) {
    this.cabang = cbg;
    console.log('Pilih regional : ', cbg)
    // this.getDataTransRegtim(41, this.kdgudang, this.username, this.tipeuser, this.myDate.substring(0, 10));
    this.scrollTop();
    this.getDataTransRecapMonthly2(41, this.kdgudang, this.username, this.tipeuser);
  }

  showTrans1(kdcabang) {
    console.log('kdabang : ', kdcabang)
    this.scrollTop();
    this.getDataTransRecapMonthly(kdcabang, this.kdgudang, this.username, this.tipeuser);
  }

  showTrans2(kdcabang) {
    console.log('kdabang : ', kdcabang)
    this.scrollTop();
    this.getDataTransRecapMonthly2(kdcabang, this.kdgudang, this.username, this.tipeuser);
  }

  getDataTransRecapMonthly(kdcabang, kdgudang, username, tipeuser) {
    let body = {
      kdcabang: kdcabang,
      kdgudang: kdgudang,
      username: username,
      tipeuser: tipeuser,
      tanggal: this.myDate.substring(0, 10),
      aksi: 'get_check_trans_monthly',
    };
    console.log(body);
    this.presentLoading();
    this.postPvdr.postData(body, 'Transaction').subscribe((data) => {
      var alertmsg = data.msg;
      if (data.success) {
        this.loader.dismiss();
        this.trans_recap_monthly_list = [];
        for (let i = 0; i < data.result.length; i++) {
          this.trans_recap_monthly_list.push({
            'namasalesman': data.result[i].salesman,
            'jumlahso': data.result[i].jumlahso,
          })
        }
        console.log('Data : ', this.trans_recap_monthly_list);
      }
      else {
        this.loader.dismiss();
        const toast = this.toastCtrl.create({
          message: alertmsg,
          duration: 2000,
          position: 'top'
        });
        toast.present();
      }
    }, error => {
      this.loader.dismiss();
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
              this.getDataTransRecapMonthly(kdcabang, kdgudang, username, tipeuser);
            }
          }
        ]
      });
      confirm.present();
    });
  }

  getDataTransRecapMonthly2(kdcabang, kdgudang, username, tipeuser) {
    let body = {
      kdcabang: kdcabang,
      kdgudang: kdgudang,
      username: username,
      tipeuser: tipeuser,
      tanggal: this.myDate.substring(0, 10),
      aksi: 'get_check_trans_monthly',
    };
    console.log(body);
    this.presentLoading();
    this.postPvdr.postDataRegtim(body, 'Transaction').subscribe((data) => {
      var alertmsg = data.msg;
      if (data.success) {
        this.loader.dismiss();
        this.trans_recap_monthly_list = [];
        for (let i = 0; i < data.result.length; i++) {
          this.trans_recap_monthly_list.push({
            'namasalesman': data.result[i].salesman,
            'jumlahso': data.result[i].jumlahso,
          })
        }
        console.log('Data : ', this.trans_recap_monthly_list);
      }
      else {
        this.loader.dismiss();
        const toast = this.toastCtrl.create({
          message: alertmsg,
          duration: 2000,
          position: 'top'
        });
        toast.present();
      }
    }, error => {
      this.loader.dismiss();
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
              this.getDataTransRecapMonthly(kdcabang, kdgudang, username, tipeuser);
            }
          }
        ]
      });
      confirm.present();
    });
  }

}
