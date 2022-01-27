import { Component, ElementRef, ViewChild } from "@angular/core";
import { IonicPage, NavController, NavParams, ViewController, LoadingController, AlertController } from "ionic-angular";
import { SQLite, SQLiteObject } from "@ionic-native/sqlite";
import { PostProvider } from "../../providers/post-provider";
import { Storage } from "@ionic/Storage";
import { CheckinPage } from "../checkin/checkin";
declare var google;

@IonicPage()
@Component({
  selector: "page-historycheckindetail",
  templateUrl: "historycheckindetail.html"
})
export class HistorycheckindetailPage {

  @ViewChild('map') mapElement: ElementRef;
  map: any;

  list_checkin: any;
  idcekinpending: any;

  idcheckin: any;
  kdsalesman: any;
  kdoutlet: any;
  nama_outlet: any;
  truelocation: any;
  longitude: any;
  latitude: any;
  waktuin: any;
  waktuout: any;
  kdcabang: any;
  tglcheckin: any;
  sendstatus: any;
  statuscekin: any;
  loader: any;
  latLng: any;


  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    public viewCtrl: ViewController,
    private sqlite: SQLite,
    public loadingCtrl: LoadingController,
    public postPvdr: PostProvider,
    public alertCtrl: AlertController,
    private storage: Storage) {
    // add
    this.getCurrentData(
      navParams.get('idcheckin'),
      navParams.get('kd_outlet'),
      navParams.get('nama_outlet'),
      navParams.get('on_loc'),
      navParams.get('lat'),
      navParams.get('lng'),
      navParams.get('keterangan'),
      navParams.get('waktu_cin'),
      navParams.get('waktu_cout')
    );

    this.loadMap();

  }

  ionViewDidLoad() {
    console.log("ionViewDidLoad HistorycheckindetailPage");
  }

  getDismiss(reload) {
    this.viewCtrl.dismiss({ reload: reload });
  }


  getCurrentData(idcheckin, kd_outlet, nama_outlet, on_loc, lat, lng, keterangan, waktu_cin, waktu_cout) {
    this.idcheckin = idcheckin;
    this.kdoutlet = kd_outlet;
    this.nama_outlet = nama_outlet;
    this.truelocation = on_loc;
    this.latitude = lng;
    this.longitude = lat;
    this.statuscekin = keterangan;
    this.waktuin = waktu_cin;
    this.waktuout = waktu_cout;

  }

  getpending() {
    this.idcekinpending = this.idcheckin;
    this.sqlite.create({ name: "vci_mobile.db", location: "default" }).then((db: SQLiteObject) => {
      db.executeSql("select * from cek_in where IdCekIn = ? order by IdCekIn desc", [this.idcekinpending]).then((res) => {
        if (res.rows.length > 0) {
          document.getElementById("data_found").style.display = "";
          (this.idcheckin = res.rows.item(0).IdCekIn),
            (this.kdsalesman = res.rows.item(0).KdSalesman),
            (this.kdoutlet = res.rows.item(0).KdOutlet),
            (this.nama_outlet = res.rows.item(0).NamaOutlet),
            (this.truelocation = res.rows.item(0).TrueLocation),
            (this.latitude = res.rows.item(0).Longitude),
            (this.longitude = res.rows.item(0).Longitude),
            (this.waktuin = res.rows.item(0).WaktuIn),
            (this.waktuout = res.rows.item(0).WaktuOut),
            (this.kdcabang = res.rows.item(0).KdCabang),
            (this.tglcheckin = res.rows.item(0).TglCheckIn);
        } else {
          document.getElementById("no_data").style.display = "";
          document.getElementById("data_found").style.display = "none";
        }
      }).catch((e) => console.log("Failed insert table order_temp", e));
    });
  }

  async presentLoading() {
    this.loader = await this.loadingCtrl.create({ content: "", duration: 2000 });
    return await this.loader.present();
  }

  sendDataCheckIn() {
    let body = {
      idcheckin: String(this.idcheckin),
      kdsalesman: this.kdsalesman,
      kdoutlet: this.kdoutlet,
      truelocation: this.truelocation,
      latitude: this.latitude,
      longitude: this.longitude,
      waktuin: this.waktuin,
      waktuout: this.waktuout,
      kdcabang: this.kdcabang,
      statuscekin: this.statuscekin,
      aksi: "send_data_checkin"
    };
    console.log(body);
    this.presentLoading();
    this.postPvdr.postData(body, "SendCheckIn").subscribe((data) => {
      var alertpesan = data.msg;
      if (data.success) {
        this.loader.dismiss();

        // Update status jadi 1 kalo ke kirim
        this.sqlite.create({ name: "vci_mobile.db", location: "default" }).then((db: SQLiteObject) => {
          db.executeSql("UPDATE cek_in SET send_status = 1 WHERE IdCekIn = ?", [this.idcheckin]).then((res) => {
            console.log("Success update table cek_in where transaction number", this.idcheckin);
          }).catch((e) => console.log("Failed update table order_temp", e));
        });

        const alert = this.alertCtrl.create({
          title: "Kunjungan " + alertpesan,
          subTitle: "Kunjungan di outlet " + this.nama_outlet + " " + alertpesan,
          buttons: [
            {
              text: "Ok",
              handler: () => {
                this.storage.remove("outlet_temp");
                this.getDismiss(true);
              }
            }
          ]
        });

        alert.present();
      } else {
        this.loader.dismiss();

        const alert = this.alertCtrl.create({
          title: "Kunjungan " + alertpesan,
          subTitle: "Kunjungan di outlet " + this.nama_outlet + " " + alertpesan,
          buttons: [
            {
              text: "Ok",
              handler: () => {
                this.storage.remove("outlet_temp");
                // this.navCtrl.setRoot(HomePage);
                this.getDismiss(true);
              }
            }
          ]
        });
        alert.present();
      }
    }, (error) => {
      this.loader.dismiss();
      const alert = this.alertCtrl.create({
        title: "Perhatian",
        subTitle: "Tidak tersabung dengan jaringan internet, cek kembali signal atau kuota internet anda!",
        buttons: [
          {
            text: "Ok",
            handler: () => {
              this.storage.remove("outlet_temp");
              this.getDismiss(true);
            }
          }
        ]
      });
      alert.present();

      // Update status jadi 0 kalo tidak kirim
      this.sqlite.create({ name: "vci_mobile.db", location: "default" }).then((db: SQLiteObject) => {
        db.executeSql("UPDATE cek_in SET send_status = 0 WHERE IdCekIn = ?", [this.idcheckin]).then((res) => {
          console.log("Success update table cek_in where transaction number", this.idcheckin);
        }).catch((e) => console.log("Failed update table order_temp", e));
      });
    });
  }

  loadMap() {
    let latLng = new google.maps.LatLng(-34.9290, 138.6010);
    let mapOptions = {
      center: latLng,
      zoom: 15,
      mapTypeId: google.maps.MapTypeId.ROADMAP
    }
    this.map = new google.maps.Map(this.mapElement.nativeElement, mapOptions);
  }

  addMarker() {
    let marker = new google.maps.Marker({
      map: this.map,
      animation: google.maps.Animation.DROP,
      position: this.map.getCenter()
    });
    let content = "<h4>Information!</h4>";
    this.addInfoWindow(marker, content);
  }

  addInfoWindow(marker, content) {
    let infoWindow = new google.maps.InfoWindow({
      content: content
    });
    google.maps.event.addListener(marker, 'click', () => {
      infoWindow.open(this.map, marker);
    });

  }

  gotoPageOrder() {
    this.navCtrl.push(CheckinPage)
  }

}
