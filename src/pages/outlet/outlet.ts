import { Component, ViewChild } from "@angular/core";
import {
  IonicPage,
  NavController,
  NavParams,
  Content,
  Platform,
  AlertController,
  ToastController,
  LoadingController
} from "ionic-angular";
// import { SQLite, SQLiteObject } from '@ionic-native/sqlite';
import { Storage } from "@ionic/Storage";
import { PostProvider } from "../../providers/post-provider";

@IonicPage()
@Component({ selector: "page-outlet", templateUrl: "outlet.html" })
export class OutletPage {
  items;
  itemz;
  // items: Array<any>;

  // @ViewChild('input') myInput;
  @ViewChild(Content) content: Content;

  row_data: Array<any>;
  limit: any;
  offset: any;
  list_outlet: any;
  search: string = "";

  kdcabang: any;
  kdgudang: any;

  loader: any;

  constructor(public navCtrl: NavController, public navParams: NavParams,
    // private sqlite: SQLite,
    private platform: Platform, private storage: Storage, public alertCtrl: AlertController, public toastCtrl: ToastController, public postPvdr: PostProvider, public loadingCtrl: LoadingController) {
    // this.platform.ready().then(() => {

    // this.row_data = new Array();
    // this.getListOutlet(0, '');
    // console.log('Load Construct function');
    // this.loadData();

    // });
    this.storage.get("outlet").then((res) => {
      this.itemz = [];
      for (let i = 0; i < res.length; i++) {
        let str_name = res[i].KdOutlet + " " + res[i].Nama;
        this.itemz.push({
          KdOutlet: res[i].KdOutlet,
          Nama: res[i].Nama,
          pcodename: str_name,
          Alm1Toko: res[i].Alm1Toko,
          Alm2Toko: res[i].Alm2Toko,
          KotaToko: res[i].KotaToko,
          ContactPr: res[i].ContactPr,
          KdCabang: res[i].KdCabang
        });
      }
      this.initializeItems();
    });


    this.storage.get("session_user_salesman").then((res) => {
      this.kdcabang = res[0].KdCabang;
      this.kdgudang = res[0].KdGudang;
      console.log("Kode Cabang ", this.kdcabang);
      console.log("Kode Gudang ", this.kdgudang);
    });
  }

  ionViewDidLoad() {
    console.log("ionViewDidLoad OutletPage");
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
        this.loader.dismiss();
        const toast = this.toastCtrl.create({ message: "Outlet telah tersinkronisasi", duration: 2000, position: "top" });
        toast.present();
        this.navCtrl.pop();
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

  loadData() {
    this.row_data = new Array();
    this.getListOutlet(0, "");
  }

  refresher() {
    this.row_data = new Array();
    this.getListOutlet(0, "");
  }

  doRefresh(refresher) {
    console.log("Begin async operation", refresher);
    this.refresher();
    setTimeout(() => {
      console.log("Async operation has ended");
      refresher.complete();
    }, 2000);
  }

  // getItems(ev) {
  //   var val = ev.target.value;
  //   this.row_data = new Array();
  //   this.getListOutlet(0, val);
  // }

  onClear(ev) {
    var val = "";
    this.row_data = new Array();
    this.getListOutlet(0, val);
  }

  getListOutlet(limit, search) {
    this.limit = limit;
    this.search = search;

    this.platform.ready().then(() => {
      // this.sqlite.create({
      //   name: 'mobile_salesman.db',
      //   location: 'default'
      // }).then((db: SQLiteObject) => {
      //   db.executeSql('SELECT * FROM outlet WHERE 1 AND (Nama LIKE ? OR KdOutlet LIKE ?) GROUP BY Nama ORDER BY Nama ASC LIMIT ?,20', ['%' + search + '%', '%' + search + '%', limit])
      //     .then(res => {
      //        console.log(res);
      //       console.log('Load list outlet ', res);
      //       this.row_data = new Array();
      //       for (let i = 0; i <= res.rows.length; i++) {
      //         this.row_data.push({
      //           'KdOutlet': res.rows.item(i).KdOutlet,
      //           'Nama': res.rows.item(i).Nama,
      //           'Alm1Toko': res.rows.item(i).Alm1Toko,
      //           'Alm2Toko': res.rows.item(i).Alm2Toko,
      //           'KotaToko': res.rows.item(i).KotaToko,
      //           'ContactPr': res.rows.item(i).ContactPr,
      //           'KdCabang': res.rows.item(i).KdCabang
      //         })
      //       }
      //     })
      //     .catch(e => {
      //        Your Code Here
      //     });
      // });
    });
  }

  doInfinite(infiniteScroll, limit, search) {
    limit = limit + 20;
    setTimeout(() => {
      this.getListOutlet(limit, search);
      infiniteScroll.complete();
    }, 500);
  }

  scrollTop() {
    this.content.scrollToTop(0);
  }
}
