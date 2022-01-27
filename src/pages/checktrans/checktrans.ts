import { Component, ViewChild } from '@angular/core';
import { AlertController, Content, IonicPage, LoadingController, ModalController, NavController, NavParams, ToastController } from 'ionic-angular';
import { Storage } from '@ionic/Storage';
import { PostProvider } from '../../providers/post-provider';
import { HistorytransdetailPage } from '../historytransdetail/historytransdetail';
import { CheckrecaptransPage } from '../checkrecaptrans/checkrecaptrans';

@IonicPage()
@Component({
  selector: 'page-checktrans',
  templateUrl: 'checktrans.html',
})
export class ChecktransPage {

  @ViewChild(Content) content: Content;

  kdcabang: any;
  kdcabang2: any;
  kdgudang: any;
  kdsales: any;
  username: any;
  tipeuser: any;

  loader: any;
  trans_so_list: any;
  trans_recap_monthly_list: any;

  // regional: string = "regbar";
  regional: any;
  // cabang: string = "jk1";
  cabang: any;

  myDate: String = new Date().toISOString();

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
    public loadingCtrl: LoadingController,
    public postPvdr: PostProvider,
    public alertCtrl: AlertController,
    public modalCtrl: ModalController,
    public toastCtrl: ToastController) {

    this.storage.get('session_user_salesman').then((res) => {
      this.kdcabang = res[0].KdCabang;
      this.kdgudang = res[0].KdGudang;
      this.kdsales = res[0].KdSales;
      this.username = res[0].UserName;
      this.tipeuser = res[0].KodeTipeUser;
      console.log('Kode tipe user ', this.tipeuser);
      console.log('Kode Cabang ', this.kdcabang);
      console.log('Kode Gudang ', this.kdgudang);
      if (this.tipeuser == 'RM0001') {
        document.getElementById('regbar').style.display = '';
        document.getElementById('regtim').style.display = 'none';
        this.getDataTransRegbar(31, this.kdgudang, this.username, this.tipeuser, this.myDate.substring(0, 10));
        this.regional = 'regbar';
        this.cabang = 'jk1';
        this.kdcabang2 = 31;
      } else if (this.tipeuser == 'RM0002') {
        document.getElementById('regbar').style.display = 'none';
        document.getElementById('regtim').style.display = '';
        this.getDataTransRegtim(41, this.kdgudang, this.username, this.tipeuser, this.myDate.substring(0, 10));
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
          this.getDataTransRegbar(this.kdcabang, this.kdgudang, this.username, this.tipeuser, this.myDate.substring(0, 10));
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
          this.getDataTransRegbar(this.kdcabang, this.kdgudang, this.username, this.tipeuser, this.myDate.substring(0, 10));
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
          this.getDataTransRegbar(this.kdcabang, this.kdgudang, this.username, this.tipeuser, this.myDate.substring(0, 10));
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
          this.getDataTransRegtim(this.kdcabang, this.kdgudang, this.username, this.tipeuser, this.myDate.substring(0, 10));
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
          this.getDataTransRegtim(this.kdcabang, this.kdgudang, this.username, this.tipeuser, this.myDate.substring(0, 10));
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
          this.getDataTransRegtim(this.kdcabang, this.kdgudang, this.username, this.tipeuser, this.myDate.substring(0, 10));
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
          this.getDataTransRegbar(this.kdcabang, this.kdgudang, this.username, this.tipeuser, this.myDate.substring(0, 10));
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
          this.getDataTransRegbar(this.kdcabang, this.kdgudang, this.username, this.tipeuser, this.myDate.substring(0, 10));
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
          this.getDataTransRegbar(this.kdcabang, this.kdgudang, this.username, this.tipeuser, this.myDate.substring(0, 10));
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
          this.getDataTransRegtim(this.kdcabang, this.kdgudang, this.username, this.tipeuser, this.myDate.substring(0, 10));
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
          this.getDataTransRegtim(this.kdcabang, this.kdgudang, this.username, this.tipeuser, this.myDate.substring(0, 10));
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
          this.getDataTransRegtim(this.kdcabang, this.kdgudang, this.username, this.tipeuser, this.myDate.substring(0, 10));
        }
      }

      else {
        this.getDataTransRegbar(31, this.kdgudang, this.username, this.tipeuser, this.myDate.substring(0, 10));
        this.regional = 'regbar';
        this.cabang = 'jk1';
        this.kdcabang2 = 31;
      }
    });


  }

  scrollTop() {
    this.content.scrollToTop(0);
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad ChecktransPage');
  }

  // ionViewDidEnter() {
  //   // this.scrollTop();
  //   if (this.tipeuser == 'RM0001') {
  //     document.getElementById('regbar').style.display = '';
  //     document.getElementById('regtim').style.display = 'none';
  //     this.getDataTransRegbar(31);
  //     this.regional = 'regbar';
  //     this.cabang = 'jk1';
  //   } else if (this.tipeuser == 'RM0002') {
  //     document.getElementById('regbar').style.display = 'none';
  //     document.getElementById('regtim').style.display = '';
  //     this.getDataTransRegtim(41);
  //     this.regional = 'regtim';
  //     this.cabang = 'sby';
  //   } else {
  //     this.getDataTransRegbar(31);
  //     this.regional = 'regbar';
  //     this.cabang = 'jk1';
  //   }
  // }

  underDevelopment() {
    const toast = this.toastCtrl.create({
      message: 'Menu ini masih dalam tahap pengembangan',
      position: 'middle',
      duration: 3000
    });
    toast.present();
  }

  async presentLoading() {
    this.loader = await this.loadingCtrl.create({
      content: "",
      // duration: 2000
    });
    return await this.loader.present();
  }

  selectDate() {
    this.myDate = this.myDate.substring(0, 10);
    console.log('Date is REGBAR : ', this.myDate);
    this.getDataTransRegbar(this.kdcabang2, this.kdgudang, this.username, this.tipeuser, this.myDate.substring(0, 10));
  }

  selectDate2() {
    this.myDate = this.myDate.substring(0, 10);
    console.log('Date is REGTIM : ', this.myDate);
    this.getDataTransRegtim(this.kdcabang2, this.kdgudang, this.username, this.tipeuser, this.myDate.substring(0, 10));
  }

  selectRegional1(cbg) {
    this.cabang = cbg;
    console.log('Pilih regional : ', cbg)
    this.kdcabang2 = 31;
    this.getDataTransRegbar(31, this.kdgudang, this.username, this.tipeuser, this.myDate.substring(0, 10));
    this.scrollTop();
    document.getElementById('cab_regbar').style.display = '';
    document.getElementById('cab_regtim').style.display = 'none';
  }

  selectRegional2(cbg) {
    this.cabang = cbg;
    console.log('Pilih regional : ', cbg)
    this.kdcabang2 = 41;
    this.getDataTransRegtim(41, this.kdgudang, this.username, this.tipeuser, this.myDate.substring(0, 10));
    this.scrollTop();
    document.getElementById('cab_regbar').style.display = 'none';
    document.getElementById('cab_regtim').style.display = '';
  }

  showTrans1(kdcabang) {
    this.kdcabang2 = kdcabang;
    console.log('kdabang : ', kdcabang)
    console.log('kdabang2 : ', this.kdcabang2)
    this.getDataTransRegbar(kdcabang, this.kdgudang, this.username, this.tipeuser, this.myDate.substring(0, 10))
    this.scrollTop();
  }

  showTrans2(kdcabang) {
    this.kdcabang2 = kdcabang;
    console.log('kdabang : ', kdcabang)
    console.log('kdabang2 : ', this.kdcabang2)
    this.getDataTransRegtim(kdcabang, this.kdgudang, this.username, this.tipeuser, this.myDate.substring(0, 10))
    this.scrollTop();
  }

  getDataTransRegbar(kdcabang, kdgudang, username, tipeuser, tanggal) {
    // this.getDataTransRecapMonthly(kdcabang, kdgudang, username, tipeuser, tanggal);
    let body = {
      kdcabang: kdcabang,
      kdgudang: kdgudang,
      username: username,
      tipeuser: tipeuser,
      tanggal: tanggal,
      aksi: 'get_check_trans',
    };
    console.log(body);
    this.presentLoading();
    this.postPvdr.postData(body, 'Transaction').subscribe((data) => {
      var alertmsg = data.msg;
      if (data.success) {
        document.getElementById('data_empty').style.display = 'none';
        document.getElementById('data_not_empty').style.display = '';
        this.scrollTop();
        this.loader.dismiss();
        this.trans_so_list = [];
        var tgl = "";
        var tgl_1 = "";
        var tgl_2 = "";
        var namacabang = "";
        var namacabang1 = "";
        var namacabang2 = "";
        var namadepo = "";
        var namadepo1 = "";
        var namadepo2 = "";
        for (let i = 0; i < data.result.length; i++) {
          tgl_1 = data.result[i].TglSO;
          namacabang1 = data.result[i].NamaCabang;
          namadepo1 = data.result[i].NamaDepo;
          if (tgl_1 != tgl_2) {
            tgl = tgl_1;
          } else {
            tgl = "";
          }
          if (namacabang1 != namacabang2) {
            namacabang = namacabang1;
          } else {
            namacabang = "";
          }
          if (namadepo1 != namadepo2) {
            namadepo = namadepo1;
          } else {
            namadepo = "";
          }
          this.trans_so_list.push({
            'noso': data.result[i].NoSO,
            'tgl_so': tgl,
            'nama_cabang': namacabang,
            'nama_depo': namadepo,
            'tglso': data.result[i].TglSO,
            'nama_outlet': data.result[i].NamaOutlet,
            'employee_name': data.result[i].employee_name,
            'status': data.result[i].Status,
            'kdcabang': data.result[i].KdCabang,
            'kdgudang': data.result[i].KdGudang,
            'namadepo': data.result[i].NamaDepo,
            'color_status': data.result[i].color_status
          })
          tgl_2 = data.result[i].TglSO;
          namacabang2 = data.result[i].NamaCabang;
          namadepo2 = data.result[i].NamaDepo;
        }
        console.log('Data : ', this.trans_so_list);
      } else {
        document.getElementById('data_not_empty').style.display = 'none';
        document.getElementById('data_empty').style.display = '';
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
              this.getDataTransRegbar(kdcabang, kdgudang, username, tipeuser, tanggal);
            }
          }
        ]
      });
      confirm.present();
    });
  }

  lihatPO() {
    document.getElementById('table_po').style.display = '';
  }

  getDataTransRecapMonthly(kdcabang, kdgudang, username, tipeuser, tanggal) {
    let body = {
      kdcabang: kdcabang,
      kdgudang: kdgudang,
      username: username,
      tipeuser: tipeuser,
      tanggal: tanggal,
      aksi: 'get_check_trans_monthly',
    };
    console.log(body);
    // this.presentLoading();
    this.postPvdr.postData(body, 'Transaction').subscribe((data) => {
      var alertmsg = data.msg;
      if (data.success) {
        // this.loader.dismiss();
        // document.getElementById('table_po').style.display = '';
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
        // this.loader.dismiss();
        const toast = this.toastCtrl.create({
          message: alertmsg,
          duration: 2000,
          position: 'top'
        });
        toast.present();
      }
    }, error => {
      // this.loader.dismiss();
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
              this.getDataTransRecapMonthly(kdcabang, kdgudang, username, tipeuser, tanggal);
            }
          }
        ]
      });
      confirm.present();
    });
  }

  getDataTransRegtim(kdcabang, kdgudang, username, tipeuser, tanggal) {
    let body = {
      kdcabang: kdcabang,
      kdgudang: kdgudang,
      username: username,
      tipeuser: tipeuser,
      tanggal: tanggal,
      aksi: 'get_check_trans',
    };
    console.log(body);
    this.presentLoading();
    this.postPvdr.postDataRegtim(body, 'Transaction').subscribe((data) => {
      var alertmsg = data.msg;
      if (data.success) {
        document.getElementById('data_empty').style.display = 'none';
        document.getElementById('data_not_empty').style.display = '';
        this.scrollTop();
        this.loader.dismiss();
        this.trans_so_list = [];
        var tgl = "";
        var tgl_1 = "";
        var tgl_2 = "";
        var namacabang = "";
        var namacabang1 = "";
        var namacabang2 = "";
        for (let i = 0; i < data.result.length; i++) {
          tgl_1 = data.result[i].TglSO;
          namacabang1 = data.result[i].NamaCabang;
          if (tgl_1 != tgl_2) {
            tgl = tgl_1;
          } else {
            tgl = "";
          }
          if (namacabang1 != namacabang2) {
            namacabang = namacabang1;
          } else {
            namacabang = "";
          }
          this.trans_so_list.push({
            'noso': data.result[i].NoSO,
            'tgl_so': tgl,
            'nama_cabang': namacabang,
            'tglso': data.result[i].TglSO,
            'nama_outlet': data.result[i].NamaOutlet,
            'employee_name': data.result[i].employee_name,
            'status': data.result[i].Status,
            'kdcabang': data.result[i].KdCabang,
            'kdgudang': data.result[i].KdGudang,
            'namadepo': data.result[i].NamaDepo,
            'color_status': data.result[i].color_status
          })
          tgl_2 = data.result[i].TglSO;
          namacabang2 = data.result[i].NamaCabang;
        }
        console.log('Data : ', this.trans_so_list);
      } else {
        document.getElementById('data_not_empty').style.display = 'none';
        document.getElementById('data_empty').style.display = '';
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
              this.getDataTransRegtim(kdcabang, kdgudang, username, tipeuser, tanggal);
            }
          }
        ]
      });
      confirm.present();
    });
  }

  getTransDetail(noso, outlet, kdcabang, kdgudang) {
    console.log('noso ', noso)
    console.log('outlet ', outlet)
    console.log('kdcabang ', kdcabang)
    console.log('kdgudang ', kdgudang)
    let trans_detail = this.modalCtrl.create(HistorytransdetailPage, { noso: noso, outlet: outlet, kdcabang: kdcabang, kdgudang: kdgudang });
    trans_detail.present();
  }

  openMenuTransRecap() {
    this.navCtrl.push(CheckrecaptransPage, { kdcabang: this.kdcabang, kdgudang: this.kdgudang, username: this.username, tipeuser: this.tipeuser });
  }

}
