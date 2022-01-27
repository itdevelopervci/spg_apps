import { Component } from "@angular/core";
import {
  IonicPage,
  NavController,
  NavParams,
  AlertController,
  ViewController,
  ToastController,
  LoadingController
} from "ionic-angular";
import { Storage } from "@ionic/Storage";
import { PostProvider } from "../../providers/post-provider";

@IonicPage()
@Component({ selector: "page-pilihoutlet", templateUrl: "pilihoutlet.html" })
export class PilihoutletPage {
  items;
  itemz;
  kdcabang: any;
  loader: any;

  constructor(public navCtrl: NavController, public navParams: NavParams, private storage: Storage, public alertCtrl: AlertController, public viewCtrl: ViewController, public toastCtrl: ToastController, public postPvdr: PostProvider, public loadingCtrl: LoadingController) {
    this.storage.get("session_user_salesman").then((res) => {
      this.kdcabang = res[0].KdCabang;
      console.log("Kode Cabang ", this.kdcabang);
    });
    this.storage.get("outlet").then((res) => {
      console.log("Data Outelt ", res);
      this.itemz = [];
      for (let i = 0; i < res.length; i++) {
        let str_sch = res[i].KdOutlet + " " + res[i].Nama;
        this.itemz.push({
          KdOutlet: res[i].KdOutlet,
          Nama: res[i].Nama,
          sch_outlet: str_sch,
          Alm1Toko: res[i].Alm1Toko,
          Alm2Toko: res[i].Alm2Toko,
          KotaToko: res[i].KotaToko,
          ContactPr: res[i].ContactPr,
          KdCabang: res[i].KdCabang,
          KdDisc: res[i].nilai,
          Trm: res[i].Trm,
          payflag: res[i].payflag
        });
      }
      this.initializeItems();
    });
  }

  ionViewDidLoad() {
    console.log("ionViewDidLoad PilihoutletPage");
    this.storage.remove('isCheckIn');
  }

  initializeItems() {
    this.items = this.itemz;
  }

  getItems(ev) {
    this.initializeItems();
    var val = ev.target.value;
    if (val && val.trim() != "") {
      this.items = this.items.filter((item) => {
        return (item.sch_outlet.toLowerCase().indexOf(val.toLowerCase()) > -1);
      });
    }
  }

  selectOutlet(nama, kdoutlet, kddisc, trm, payflag) {
    const alert = this.alertCtrl.create({
      title: "Outlet Terpilih",
      subTitle: "Nama Outlet " + nama + " dengan kode outlet " + kdoutlet,
      buttons: [
        {
          text: "Pilih",
          handler: () => {
            var outlet_temp = [
              {
                Nama: nama
              }, {
                KdOutlet: kdoutlet
              }, {
                KdDisc: kddisc
              }, {
                Trm: trm
              }, {
                payflag: payflag
              }
            ];
            this.storage.set("outlet_temp", outlet_temp);
            this.getDismiss(true);
          }
        }
      ]
    });
    alert.present();
  }

  getDismiss(reload) {
    this.viewCtrl.dismiss({ reload: reload });
  }

  scanQrOutlet() {
    this.underDevelopment();
  }

  underDevelopment() {
    const toast = this.toastCtrl.create({ message: "Menu ini masih dalam tahap pengembangan.", duration: 2000, position: "bottom" });
    toast.present();
  }

  async presentLoading() {
    this.loader = await this.loadingCtrl.create({ content: "", });
    return await this.loader.present();
  }

  getMasterOutlet() {
    let body = {
      kdcabang: this.kdcabang,
      aksi: "get_master_outlet"
    };
    this.presentLoading();
    this.postPvdr.postData(body, "Outlet").subscribe((data) => {
      var alertpesan = data.msg;
      if (data.success) {
        this.storage.set("outlet", data.result);
        console.log(data.result)
        this.loader.dismiss();
        const toast = this.toastCtrl.create({ message: "Outlet telah tersinkronisasi", duration: 2000, position: "top" });
        toast.present();
        // this.navCtrl.pop();
        this.getDismiss(true);
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
}
