import { Component } from "@angular/core";
import {
  IonicPage,
  NavController,
  NavParams,
  ViewController,
  AlertController,
  ToastController,
  LoadingController,
  ModalController
} from "ionic-angular";
import { Storage } from "@ionic/Storage";
import { PostProvider } from "../../providers/post-provider";
import { TambahprodukdetailPage } from "../tambahprodukdetail/tambahprodukdetail";

@IonicPage()
@Component({ selector: "page-tambahproduk", templateUrl: "tambahproduk.html" })
export class TambahprodukPage {
  testRadioOpen: boolean;
  testRadioResult;

  items;
  itemz;
  todayDate: String = new Date().toISOString();
  bulan_aktif: any;
  tahun_aktif: any;
  loader: any;
  kdcabang: any;
  kdgudang: any;
  qty: any;

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    public viewCtrl: ViewController,
    private storage: Storage,
    public alertCtrl: AlertController,
    public toastCtrl: ToastController,
    public postPvdr: PostProvider,
    public loadingCtrl: LoadingController,
    public modalCtrl: ModalController) {

    this.initializeItems();
    this.getBulan();
    this.getTahun();

    this.storage.get("session_user_salesman").then((res) => {
      this.kdcabang = res[0].KdCabang;
      this.kdgudang = res[0].KdGudang;
      console.log("Kode Cabang ", this.kdcabang);
      console.log("Kode Gudang ", this.kdgudang);
    });

    this.storage.get("produk").then((res) => {
      console.log("Produk ", res);
      this.itemz = [];
      for (let i = 0; i < res.length; i++) {
        let str_name = res[i].PCode + " " + res[i].NamaBarang;
        this.itemz.push({
          PCode: res[i].PCode,
          NamaBarang: res[i].NamaBarang,
          pcodename: str_name,
          GAkhir: res[i].GAkhir,
          KdCabang: res[i].KdCabang,
          KdGudang: res[i].KdGudang,
          KdKelas: res[i].KdKelas,
          HJualkecil: res[i].HJualkecil,
          KonversiKcl: res[i].KonversiKcl,
          KonversiBsr: res[i].KonversiBsr,
          ppn: res[i].ppn
        });
      }
      this.initializeItems();
    });

    // document.addEventListener("backbutton", function (e) {
    //   this.getDismiss(true);
    // }, true);
  }

  ionViewDidLoad() {
    console.log("ionViewDidLoad TambahprodukPage");
  }

  getDismiss(reload) {
    this.viewCtrl.dismiss({ reload: reload });
  }

  getTahun() {
    this.tahun_aktif = this.todayDate;
    this.tahun_aktif = this.tahun_aktif.substring(0, 4);
    console.log("Tahun ", this.tahun_aktif);
  }

  getBulan() {
    this.bulan_aktif = this.todayDate;
    this.bulan_aktif = this.bulan_aktif.substring(5, 7);
    console.log("Bulan ", this.bulan_aktif);
  }

  initializeItems() {
    this.items = this.itemz;
  }

  getItems(ev) {
    this.initializeItems();
    var val = ev.target.value;
    if (val && val.trim() != "") {
      this.items = this.items.filter((item) => {
        return (item.pcodename.toLowerCase().indexOf(val.toLowerCase()) > -1);
      });
    }
  }

  async presentLoading() {
    this.loader = await this.loadingCtrl.create({ content: "", });
    return await this.loader.present();
  }

  getMasterProduct() {
    let body = {
      kdcabang: this.kdcabang,
      kdgudang: this.kdgudang,
      bulan_aktif: this.bulan_aktif,
      tahun_aktif: this.tahun_aktif,
      aksi: "getProduct"
    };
    this.presentLoading();
    this.postPvdr.postData(body, "Product").subscribe((data) => {
      var alertpesan = data.msg;
      if (data.success) {
        this.storage.set("produk", data.result);
        this.loader.dismiss();
        const toast = this.toastCtrl.create({ message: "Produk telah tersinkronisasi", duration: 5000, position: "top" });
        toast.present();
        // this.navCtrl.pop();
        this.getDismiss(false);
      } else {
        this.loader.dismiss();
        const toast = this.toastCtrl.create({ message: alertpesan, duration: 2000, position: "top" });
        toast.present();
      }
    }, (error) => {
      this.loader.dismiss();
      const alert = this.alertCtrl.create({ title: "Pehatian", subTitle: "Tidak tersabung dengan Internet, cek kembali signal atau kuota internet anda", buttons: ["OK"] });
      alert.present();
    });
  }

  addProductDetail(pcode, namabarang, hjualkecil, konversikcl, konversibsr, ppn) {

    console.log("PCode ", pcode + " Nama Barang ", namabarang);
    const modal = this.modalCtrl.create(TambahprodukdetailPage, {
      pcode: pcode,
      namabarang: namabarang,
      hjualkecil: hjualkecil,
      konversikcl: konversikcl,
      konversibsr: konversibsr,
      ppn: ppn
    });
    modal.present();

    modal.onDidDismiss((data) => {
      console.log("Reload data dari modal close ", data);
      if (data.reload) {
        // reload data
        console.log("reload function ready");
      }
    });

  }

  showPrompt(PCode, Nama) {
    const prompt = this.alertCtrl.create({
      title: "Tambah produk",
      message: "Produk yg akan di tambahkan " + PCode + " - " + Nama,
      inputs: [
        {
          name: "qty",
          placeholder: "QTY"
        }
      ],
      buttons: [
        {
          text: "Batal",
          handler: (data) => {
            console.log("Cancel clicked");
          }
        }, {
          text: "Lanjut",
          handler: (data) => {
            this.qty = data.qty;
            console.log("Saved clicked", this.qty);
            this.showRadio();
          }
        }
      ]
    });
    prompt.present();
  }

  showRadio() {
    let alert = this.alertCtrl.create();
    alert.setTitle("Lightsaber color");

    alert.addInput({ type: "radio", label: "PCS", value: "pcs", checked: true });

    alert.addInput({ type: "radio", label: "LSN", value: "lsn" });

    alert.addInput({ type: "radio", label: "CRT", value: "crt" });

    alert.addButton("Cancel");
    alert.addButton({
      text: "OK",
      handler: (data) => {
        this.testRadioOpen = false;
        this.testRadioResult = data;
        console.log("tipe_qty ", this.testRadioResult);
      }
    });
    alert.present();
  }
}
