import { Component, ViewChild, ElementRef } from "@angular/core";
import { IonicPage, NavController, NavParams, ViewController, AlertController, ToastController, Platform } from "ionic-angular";
import { SQLite, SQLiteObject } from "@ionic-native/sqlite";
import { Storage } from "@ionic/Storage";
import { AppVersion } from '@ionic-native/app-version';


@IonicPage()
@Component({ selector: "page-tambahprodukdetail", templateUrl: "tambahprodukdetail.html" })
export class TambahprodukdetailPage {
  @ViewChild('myInput') myInput: ElementRef;
  marketingtp: any;
  selectmarketingtp: any;
  selectmarketingtpname: any;
  pcode: any;
  namabarang: any;
  hjualkecil: any;
  konversipcs: Number = 1;
  konversikcl: any;
  konversibsr: any;
  ppn: any;
  nama_outlet: any;
  kd_outlet: any;
  kd_disc: any;
  disc: any;
  quantity: any;
  type_pack: any;
  type_pack_det: any;
  type_promo: any;
  type_promo_name: any;
  total_bruto: any;
  price_value_disc: any;
  price_value_disc_fix: any;
  total_netto2: any;
  total_netto2_fix: any;
  total_netto: any;
  total_netto_fix: any;
  noso: any;
  kdcabang: any;
  kdgudang: any;
  kdsales: any;
  iduser: any;
  trm: any;
  payflag: any;
  username: any;
  note: String = '';
  yearnow: String = new Date().toISOString();
  date_time: any;
  date_month: any;
  date = new Date();
  pick_month_expr: String = new Date().toISOString();
  myDate: String = new Date(this.date.getTime() - this.date.getTimezoneOffset() * 60000).toISOString();
  myTime: String = new Date(this.date.getTime() - this.date.getTimezoneOffset() * 60000).toISOString();

  versi: any;
  namapromo: any;
  nopromo: any;

  constructor(
    private sqlite: SQLite,
    public navCtrl: NavController,
    public navParams: NavParams,
    public viewCtrl: ViewController,
    private storage: Storage,
    private appVersion: AppVersion,
    private platform: Platform,
    public alertCtrl: AlertController,
    public toastCtrl: ToastController) {

    this.getCurrentData(
      navParams.get("pcode"),
      navParams.get("namabarang"),
      navParams.get("hjualkecil"),
      navParams.get("konversikcl"),
      navParams.get("konversibsr"),
      navParams.get("ppn")
    );

    this.storage.get("marketingtp").then((res) => {
      this.marketingtp = [];
      for (let i = 0; i < res.length; i++) {
        this.marketingtp.push({ id: res[i].id, Keterangan: res[i].Keterangan, BatasBonus: res[i].BatasBonus });
      }
    });

    this.storage.get('session_user_salesman').then((res) => {
      this.kdcabang = res[0].KdCabang;
      this.kdgudang = res[0].KdGudang;
      this.kdsales = res[0].KdSales;
      this.iduser = res[0].Id;
      this.username = res[0].UserName;
    });

    this.storage.get("outlet_temp").then((res) => {
      this.nama_outlet = res[0].Nama;
      this.kd_outlet = res[1].KdOutlet;
      this.kd_disc = res[2].KdDisc;
      this.disc = parseInt(this.kd_disc);
      this.trm = res[3].Trm;
      this.payflag = res[4].payflag;
      console.log('outlet temp : ', res);
    });

    this.platform.ready().then(() => {
      this.appVersion.getVersionNumber().then((res) => {
        console.log(res);
        this.versi = res;
      }, (err) => {
        console.log(err);
      });
    });

    this.konversipcs = 1;
    this.type_pack = "PCS";
    this.type_promo = "0";
    this.type_promo = "0";
    this.type_promo_name = "0";
    this.selectmarketingtp = "0";
    this.selectmarketingtpname = "0";
    this.quantity = 0;

  }

  ionViewDidLoad() {
    console.log("ionViewDidLoad TambahprodukdetailPage");
  }

  ionViewDidEnter() {
    this.storage.get("noso").then((res) => {
      var year_month = this.yearnow.substring(2, 4) + "" + this.yearnow.substring(5, 7);
      var id = res[0].noso;
      if (id == 0) {
        this.noso = this.kdcabang + this.iduser + year_month + "0001";
        console.log("NOSO baru : ", this.noso);
      } else {
        this.noso = parseInt(id) + 1;
        console.log("NOSO : ", this.noso);
      }
    });
    this.showPrompt();
  }

  resize() {
    this.myInput.nativeElement.style.height = this.myInput.nativeElement.scrollHeight + 'px';
  }

  showPrompt() {
    const prompt = this.alertCtrl.create({
      enableBackdropDismiss: false,
      title: "Quantity",
      message: "Tambah quantity pada produk ini",
      inputs: [
        {
          name: "qty",
          placeholder: this.quantity,
          type: "number"
        }
      ],
      buttons: [
        {
          text: "Batal",
          handler: (data) => {
          }
        }, {
          text: "Tambah",
          handler: (data) => {
            this.quantity = data.qty;
            if (this.quantity == '') {
              let toast = this.toastCtrl.create({
                message: 'Isi qty terlebih dahulu!',
                duration: 1000,
                position: 'top'
              });
              toast.present(toast);
            } else {
              this.setTotalPrice();
              // var promo = ({
              //   id: '0',
              //   nama: 'Tidak ada promo'
              // })
              // this.selecttpnobonus(promo);


              // this.getMarketingTPType(promo);
              this.selecttpnobonus('0', 'Tidak Ada Bonus');
            }
          }
        }
      ]
    });
    prompt.present();
  }

  getDismiss(reload) {
    this.viewCtrl.dismiss({ reload: reload });
  }

  getCurrentData(pcode, namabarang, hjualkecil, konversikcl, konversibsr, ppn) {
    this.pcode = pcode;
    this.namabarang = namabarang;
    this.hjualkecil = hjualkecil;
    this.konversikcl = konversikcl;
    this.konversibsr = konversibsr;
    this.ppn = ppn;
  }

  getMarketingTPType($event) {
    console.log('event TP: ', $event);
    // this.selectmarketingtp = $event;
    // this.selectmarketingtp = $event.tipepromo;
    // this.selectmarketingtpname = $event.namapromo;
    var tp_temp = $event;
    var tp_after_split = tp_temp.split(',');
    this.selectmarketingtp = tp_after_split[0];
    this.selectmarketingtpname = tp_after_split[1];
    console.log('tp: ', this.selectmarketingtp);
    console.log('nama tp: ', this.selectmarketingtpname);
  }

  selecttpnobonus(a, b) {
    this.selectmarketingtp = a;
    this.selectmarketingtpname = b;
    console.log('tp: ', this.selectmarketingtp);
    console.log('nama tp: ', this.selectmarketingtpname);
  }

  setTotalPrice() {
    if (this.type_pack == "PCS") {
      this.type_pack_det = this.konversipcs;
      console.log("type_pack_ det ", this.type_pack);
    } else if (this.type_pack == "LSN") {
      this.type_pack_det = this.konversikcl;
      console.log("type_pack_ det ", this.type_pack);
    } else if (this.type_pack == "CRT") {
      this.type_pack_det = this.konversibsr;
      console.log("type_pack_ det ", this.type_pack);
    }
    var price_value = Number(this.hjualkecil * this.type_pack_det);
    this.total_bruto = price_value * this.quantity;
    this.price_value_disc = Number((this.total_bruto * parseInt(this.kd_disc)) / 100);
    this.price_value_disc_fix = this.price_value_disc.toFixed(2);
    this.total_netto2 = this.total_bruto - this.price_value_disc;
    this.total_netto2_fix = this.total_netto2.toFixed(2);
    var netto_ppn = Number(this.total_netto2 * 0.1);
    this.total_netto = this.total_netto2 + netto_ppn;
    this.total_netto_fix = this.total_netto.toFixed(2);
  }

  setTotalPrice2(val) {
    if (val == "PCS") {
      this.type_pack_det = this.konversipcs;
    } else if (val == "LSN") {
      this.type_pack_det = this.konversikcl;
    } else if (val == "CRT") {
      this.type_pack_det = this.konversibsr;
    }
    var price_value = Number(this.hjualkecil * this.type_pack_det);
    this.total_bruto = price_value * this.quantity;
    this.price_value_disc = Number((this.total_bruto * parseInt(this.kd_disc)) / 100);
    this.total_netto2 = this.total_bruto - this.price_value_disc;
    var netto_ppn = Number(this.total_netto2 * 0.1);
    this.total_netto = this.total_netto2 + netto_ppn;
  }

  addProductConfirm() {
    if (this.quantity == '') {
      let toast = this.toastCtrl.create({
        message: 'Isi qty terlebih dahulu!',
        duration: 1000,
        position: 'middle'
      });
      toast.present(toast);
    } else if (this.selectmarketingtp == null || this.selectmarketingtp == '') {
      let toast = this.toastCtrl.create({
        message: 'Pilih tipe promo terlebih dahulu!',
        duration: 1000,
        position: 'middle'
      });
      toast.present(toast);
    } else {
      this.sqlite.create({
        name: 'vci_mobile.db',
        location: 'default'
      }).then((db: SQLiteObject) => {
        db.executeSql('SELECT * FROM trans_so_disc WHERE PCode = ? AND NoSO = ?', [this.pcode, this.noso])
          .then(res => {
            console.log("Success select table trans_so_disc", res);
            for (let i = 0; i < res.rows.length; i++) {
              var pcode = res.rows.item(i).PCode
            }
            if (this.pcode == pcode) {
              let toast = this.toastCtrl.create({
                message: 'Produk ini sudah pernah di input.',
                duration: 2000,
                position: 'middle'
              });
              toast.present(toast);
              // this.getDismiss(true);

              // this.sqlite.create({
              //   name: 'vci_mobile.db',
              //   location: 'default'
              // }).then((db: SQLiteObject) => {
              //   db.executeSql('DELETE FROM trans_so_disc WHERE PCode = ? AND NoSO = ?', [this.pcode, this.noso])
              //     .then(res => {
              //       console.log("Success DELETE table trans_so_disc", res);
              //       console.log("Nomor SO", this.noso);
              //       this.storage.remove('isCheckIn');
              //       this.storage.remove('outlet_temp');
              //       this.navCtrl.pop();
              //     })
              //     .catch(e => console.log("Failed  DELETE table trans_so_disc", e));
              // });

            } else {
              this.getDataInput();
            }
          })
          .catch(e => console.log("Failed select table trans_so_disc", e));
      });
    }
  }

  getDataInput() {
    this.date_time = this.myDate.substring(0, 10) + " " + this.myTime.substring(11, 19);
    this.date_month = this.myDate.substring(0, 10);
    this.pick_month_expr = this.pick_month_expr.substring(0, 10);
    this.storage.get("noso").then((res) => {
      var year_month = this.yearnow.substring(2, 4) + "" + this.yearnow.substring(5, 7);
      var id = res[0].noso;
      if (id == 0) {
        this.noso = this.kdcabang + this.iduser + year_month + "0001";
        console.log("NOSO baru : ", this.noso);
      } else {
        this.noso = parseInt(id) + 1;
        console.log("NOSO : ", this.noso);
      }
      this.insert_trans_so_disc();
    });
  }

  insert_trans_so_disc() {
    this.sqlite.create({
      name: 'vci_mobile.db',
      location: 'default'
    }).then((db: SQLiteObject) => {
      db.executeSql('INSERT INTO trans_so_disc (NoSO,PCode,PersenDisc1,NilaiAwal,RpDisc,Nilai,PersenDiscAll,AddDate,EditDate,KdGudang,KdCabang,send_status) \
                    VALUES(?,?,?,?,?,?,?,?,?,?,?,?)',
        [
          this.noso,
          this.pcode,
          this.kd_disc,
          this.total_bruto,
          this.price_value_disc,
          this.total_netto2,
          this.kd_disc,
          this.date_time,
          '0000-00-00 00:00:00',
          this.kdgudang,
          this.kdcabang,
          0,
        ])
        .then(res => {
          console.log("Success insert table trans_so_disc", res);
          this.insert_trans_so_det();
        })
        .catch(e => console.log("Failed insert table trans_so_disc", e));
    });
  }

  insert_trans_so_det() {
    this.sqlite.create({
      name: 'vci_mobile.db',
      location: 'default'
    }).then((db: SQLiteObject) => {
      db.executeSql('INSERT INTO trans_so_det (NoSO,PCode,NamaBarang,Qty,Jenis,Jumlah,Netto,TradePromo,NamaPromo,Keterangan,AddDate,Editdate,KdGudang,KdCabang,send_status ) \
                    VALUES(?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)',
        [
          this.noso,
          this.pcode,
          this.namabarang,
          this.quantity,
          this.type_pack,
          this.total_bruto,
          this.total_netto2,
          this.selectmarketingtp,
          this.selectmarketingtpname,
          this.note,
          this.date_time,
          '0000-00-00 00:00:00',
          this.kdgudang,
          this.kdcabang,
          0,
        ])
        .then(res => {
          console.log("Success insert table trans_so_det", res);
          this.insert_trans_so()
        })
        .catch(e => console.log("Failed insert table trans_so_det", e));
    });
  }

  insert_trans_so() {
    this.sqlite.create({
      name: 'vci_mobile.db',
      location: 'default'
    }).then((db: SQLiteObject) => {
      db.executeSql('INSERT INTO trans_so \
                    (NoSO,TglSO,KdSales,KdOutlet,NamaOutlet,TglPO,TglExp,UserName,PCode,NamaBarang,Netto,Netto2,PersenDisc,RpDisc,Bruto,PPN,JBayar,Trm,Keterangan, \
                      AddDate,EditDate,KdGudang,Status_Kirim,InsertDate,KdCabang,KdDevice,send_status) \
                    VALUES(?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)',
        [
          this.noso,
          this.date_month,
          this.kdsales,
          this.kd_outlet,
          this.nama_outlet,
          this.date_month,
          this.pick_month_expr,
          this.username,
          this.pcode,
          this.namabarang,
          this.total_netto,
          this.total_netto2,
          this.kd_disc,
          this.price_value_disc,
          this.total_bruto,
          this.ppn,
          this.payflag,
          this.trm,
          '',
          this.date_time,
          '0000-00-00 00:00:00',
          this.kdgudang,
          '0',
          '0000-00-00 00:00:00',
          this.kdcabang,
          this.versi,
          0
        ])
        .then(res => {
          console.log("Success insert table trans_so", res);
          let toast = this.toastCtrl.create({
            message: 'Produk berhasil ditambakan.',
            duration: 1000,
            position: 'middle'
          });
          toast.present(toast);
          this.getDismiss(true);
        })
        .catch(e => console.log("Failed insert table trans_so", e));
    });
  }


}
