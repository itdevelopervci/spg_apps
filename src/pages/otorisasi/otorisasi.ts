import { Component } from '@angular/core';
import { AlertController, IonicPage, LoadingController, NavController, NavParams, ToastController } from 'ionic-angular';
import { PostProvider } from '../../providers/post-provider';
import { Storage } from '@ionic/Storage';

import { CupertinoPane } from 'cupertino-pane';
import { ScreenOrientation } from '@ionic-native/screen-orientation';
import { OtorisasihistoryPage } from '../otorisasihistory/otorisasihistory';
import { StatusBar } from '@ionic-native/status-bar';


@IonicPage()
@Component({
  selector: 'page-otorisasi',
  templateUrl: 'otorisasi.html',
})
export class OtorisasiPage {

  otorisasi_detail: any;
  pane_status: any;

  // group: String = "all";
  // type: String = "F";

  checkAllList: boolean;
  checkAllListInitial: boolean;

  loader: any;

  usernames: any;
  otorisasi_list: any;

  selectedArray: any = [];

  checked = [];

  isChecked: boolean;

  selected_trans: any;
  selected_kdcabang: any;

  namacabang: any;
  namadepo: any;
  notransaksi: any;
  namaoutlet: any;
  tgltrans: any;
  kdoutlet: any;
  kdsales: any;
  namasls: any;
  nilaipiutang: any;
  totalpiutang: any;
  limitk: any;
  nm_tipeotorisasi: any;

  public press: number = 0;


  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    public postPvdr: PostProvider,
    public loadingCtrl: LoadingController,
    public alertCtrl: AlertController,
    public toastCtrl: ToastController,
    private storage: Storage,
    public statusBar: StatusBar,
    private screenOrientation: ScreenOrientation
  ) {

    // code here

    // get current
    console.log(this.screenOrientation.type); // logs the current orientation, example: 'landscape'

  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad OtorisasiPage');

  }

  ionViewDidEnter() {
    // set to PORTRAIT
    // this.screenOrientation.lock(this.screenOrientation.ORIENTATIONS.PORTRAIT);

    this.statusBar.backgroundColorByHexString("#ffffff");
    this.statusBar.styleDefault();

    this.storage.get('session_user_distribution').then((res) => {
      this.usernames = res[0].UserID;
      this.getDataOtorisasi(this.usernames);
    });
  }

  ionViewDidLeave() {
    if (this.pane_status == true) {
      this.closeMenuPane();
    }
  }

  async presentLoading(x) {
    this.loader = await this.loadingCtrl.create({
      content: x,
    });
    return await this.loader.present();
  }

  // Get Data otorisasi
  getDataOtorisasi(usernames) {

    let body = {
      username: usernames,
      aksi: 'get_data_otorisasi'
    };
    this.presentLoading('');
    this.postPvdr.postData(body, 'Otorisasi').subscribe((data) => {
      var alertpesan = data.msg;
      if (data.success) {
        this.loader.dismiss();
        this.otorisasi_list = [];

        var cbg = "";
        var cabang_awal = "";
        var cabang_akhir = "";

        for (let i = 0; i < data.result.length; i++) {

          cabang_awal = data.result[i].initial;
          if (cabang_awal != cabang_akhir) {
            cbg = cabang_awal;
          } else {
            cbg = "";
          }

          this.otorisasi_list.push({
            'initial': cbg,
            'namacabang': data.result[i].initial,
            'namadepo': data.result[i].namadepo,
            'kdcabang': data.result[i].kdcabang,
            'kdoutlet': data.result[i].kdoutlet,
            'kdsales': data.result[i].kdsales,
            'limitk': data.result[i].limitk,
            'nama': data.result[i].nama,
            'namasls': data.result[i].namasls,
            'nilaipiutang': data.result[i].nilaipiutang,
            'nm_tipeotorisasi': data.result[i].nm_tipeotorisasi,
            'notransaksi': data.result[i].notransaksi,
            'tgltrans': data.result[i].tgltrans,
            'totalpiutang': data.result[i].totalpiutang,
            'checked': false
          })
          cabang_akhir = data.result[i].initial;
        }
        console.log('List Otorisasi : ', this.otorisasi_list);
      } else {
        this.loader.dismiss();
        this.otorisasi_list = [];

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
          subTitle: 'Internet tidak tersambung, cek kembali signal atau kuota internet Anda.',
          buttons: ['OK']
        });
      alert.present();
    });
  }

  doRefresh(refresher) {
    this.getDataOtorisasi(this.usernames);
    setTimeout(() => {
      refresher.complete();
    }, 1000);
  }

  // addCheckbox(event, checkbox: String) {
  //   if (event.checked) {
  //     this.checked.push(checkbox);
  //   } else {
  //     let index = this.removeCheckedFromArray(checkbox);
  //     this.checked.splice(index, 1);
  //   }
  //   console.log(this.checked);
  // }

  // removeCheckedFromArray(checkbox: String) {
  //   return this.checked.findIndex((category) => {
  //     return category === checkbox;
  //   })
  // }

  // emptyCheckedArray() {
  //   this.checked = [];
  // }

  // getCheckedBoxes() {
  //   for (let i = 0; i <= this.otorisasi_list.length; i++) {
  //     this.otorisasi_list[i].checked = true;
  //   }
  //   console.log(this.checked);
  // }

  getCheckAllList() {
    setTimeout(() => {
      this.isChecked = true;
      this.otorisasi_list.forEach(obj => {
        obj.checked = this.checkAllList;
      });
    });
  }

  approvalBtn() {
    if (this.isChecked) {
      this.selected_trans = [];
      this.otorisasi_list.map(obj => {
        if (obj.checked) {
          this.selected_trans.push({
            'notransaksi': obj.notransaksi,
            'kdcabang': obj.kdcabang,
            'username': this.usernames
          });
        }
      });

      console.log('Notrans ', this.selected_trans);

      // send to api
      const confirm = this.alertCtrl.create({
        title: 'Approval',
        message: 'Apakah Anda ingin mengapprove transaksi ini ?',
        buttons: [
          {
            text: 'Batal',
            handler: () => {
              console.log('Reject clicked');
            }
          }, {
            text: 'Ya',
            handler: () => {
              console.log('Approve clicked');
              this.approvalOtorisasi(this.selected_trans);
            }
          }
        ]
      });

      confirm.present();

    } else {
      const toast = this.toastCtrl.create({
        message: 'Pilih salah satu yang ingin di otorisasi',
        duration: 2000,
        position: 'top'
      });
      toast.present();
    }
  }

  approvalOtorisasi(selected_trans) {
    let body = {
      selected_trans: selected_trans,
      aksi: 'get_approve_otorisasi'
    };
    console.log('Data yg akan dikirim : ', body);
    this.presentLoading('Sedang memproses otorisasi..');
    this.postPvdr.postData(body, 'Otorisasi').subscribe(data => {
      var alertpesan = data.msg;
      if (data.success) {
        this.loader.dismiss();
        this.getDataOtorisasi(this.usernames);
        const toast = this.toastCtrl.create({
          message: data.msg,
          duration: 2000,
          position: 'top'
        });
        toast.present();
      } else {
        this.loader.dismiss();
        const alert = this.alertCtrl.create({
          title: 'Info!!',
          subTitle: alertpesan,
          buttons: ['OK']
        });
        alert.present();
      }
    }, error => {
      this.loader.dismiss();
      const alert = this.alertCtrl.create({
        title: 'Warning!!',
        subTitle: 'Connection Failed',
        buttons: ['OK']
      });
      alert.present();
    });
  }

  addCheckbox2() {
    const totalList = this.otorisasi_list.length;
    let checkedbtn = 0;
    this.otorisasi_list.map(obj => {
      if (obj.checked) {
        checkedbtn++
      }
    });
    if (checkedbtn > 0 && checkedbtn < totalList) {
      this.isChecked = true;
    } else if (checkedbtn == totalList) {
      this.isChecked = true;
    } else {
      this.isChecked = false;
    }
  }

  addCheckbox3(kdcabang) {
    console.log('KdCabang ', kdcabang);
    // this.otorisasi_list.map(obj => {
    //   if (obj.kdcabang == kdcabang) {
    //     obj.checked = true;
    //     this.isChecked = true;
    //   }
    // })
  }

  detailOtorisasiPane(
    namacabang,
    namadepo,
    notransaksi,
    nama,
    tgltrans,
    kdoutlet,
    kdsales,
    namasls,
    nilaipiutang,
    totalpiutang,
    limitk,
    nm_tipeotorisasi) {

    this.namacabang = namacabang
    this.namadepo = namadepo
    this.notransaksi = notransaksi
    this.namaoutlet = nama
    this.tgltrans = tgltrans
    this.kdoutlet = kdoutlet
    this.kdsales = kdsales
    this.namasls = namasls
    this.nilaipiutang = nilaipiutang
    this.totalpiutang = totalpiutang
    this.limitk = limitk
    this.nm_tipeotorisasi = nm_tipeotorisasi

    this.pane_status = true;
    this.otorisasi_detail = new CupertinoPane(
      '.otorisasi-detail-pane', // Pane container selector
      {
        parentElement: 'body', // Parent container
        breaks: {
          // top: { enabled: false, height: 500, bounce: true },
          middle: { enabled: true, height: 380, bounce: true },
          bottom: { enabled: false, height: 80 },
        },
        buttonClose: true,
        clickBottomOpen: true,
        backdrop: true,
        backdropOpacity: 0.4,
        initialBreak: 'middle'

      }
    );
    this.otorisasi_detail.present({ animate: true });
  }

  closeMenuPane() {
    this.otorisasi_detail.destroy({ animate: true });
  }

  pressEvent(e, kdoutlet, kdcabang, namaoutlet) {
    this.press++
    this.navCtrl.push(OtorisasihistoryPage, { kdoutlet: kdoutlet, kdcabang: kdcabang, namaoutlet: namaoutlet })
  }

}
