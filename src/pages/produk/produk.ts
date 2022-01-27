import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, AlertController, ToastController, LoadingController } from 'ionic-angular';
import { Storage } from '@ionic/Storage';
import { PostProvider } from '../../providers/post-provider';


@IonicPage()
@Component({
  selector: 'page-produk',
  templateUrl: 'produk.html',
})
export class ProdukPage {

  items;
  itemz;
  todayDate: String = new Date().toISOString();
  bulan_aktif: any;
  tahun_aktif: any;
  loader: any;
  kdcabang: any;
  kdgudang: any;

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    private storage: Storage,
    public alertCtrl: AlertController,
    public toastCtrl: ToastController,
    public postPvdr: PostProvider,
    public loadingCtrl: LoadingController
  ) {

    this.getBulan();
    this.getTahun();

    this.storage.get('session_user_salesman').then((res) => {
      this.kdcabang = res[0].KdCabang;
      this.kdgudang = res[0].KdGudang;
      console.log('Kode Cabang ', this.kdcabang);
      console.log('Kode Gudang ', this.kdgudang);
    });

    this.storage.get('produk').then((res) => {
      this.itemz = [];
      for (let i = 0; i < res.length; i++) {
        let str_name = res[i].PCode + " " + res[i].NamaBarang;
        this.itemz.push(
          {
            'PCode': res[i].PCode,
            'NamaBarang': res[i].NamaBarang,
            'pcodename': str_name,
            'GAkhir': res[i].GAkhir,
            'KdCabang': res[i].KdCabang,
            'KdGudang': res[i].KdGudang,
            'KdKelas': res[i].KdKelas
          }
        )
      }
      this.initializeItems();
    });

  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad ProdukPage');
  }

  initializeItems() {

    this.items = this.itemz;

  }

  getItems(ev) {
    this.initializeItems();
    var val = ev.target.value;
    if (val && val.trim() != '') {
      this.items = this.items.filter((item) => {
        return (item.pcodename.toLowerCase().indexOf(val.toLowerCase()) > -1);
      })
    }
  }

  getTahun() {
    this.tahun_aktif = this.todayDate;
    this.tahun_aktif = this.tahun_aktif.substring(0, 4);
    console.log('Tahun ', this.tahun_aktif);
  }

  getBulan() {
    this.bulan_aktif = this.todayDate;
    this.bulan_aktif = this.bulan_aktif.substring(5, 7);
    console.log('Bulan ', this.bulan_aktif);
  }

  async presentLoading() {
    this.loader = await this.loadingCtrl.create({
      content: "",
    });
    return await this.loader.present();
  }

  getMasterProduct() {
    let body = {
      kdcabang: this.kdcabang,
      kdgudang: this.kdgudang,
      bulan_aktif: this.bulan_aktif,
      tahun_aktif: this.tahun_aktif,
      aksi: 'getProduct',
    };
    this.presentLoading();
    this.postPvdr.postData(body, 'Product').subscribe((data) => {
      var alertpesan = data.msg;
      if (data.success) {
        this.storage.set('produk', data.result);
        this.loader.dismiss();
        const toast = this.toastCtrl.create({
          message: 'Produk telah tersinkronisasi',
          duration: 5000,
          position: 'top'
        });
        toast.present();
        this.navCtrl.pop();
      } else {
        this.loader.dismiss();
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
          subTitle: 'Tidak tersabung dengan Internet, cek kembali signal atau kuota internet anda',
          buttons: ['OK']
        });
      alert.present();
    });
  }

}
