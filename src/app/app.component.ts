import { Component, NgZone } from "@angular/core";
import { AlertController, Platform } from "ionic-angular";
import { StatusBar } from "@ionic-native/status-bar";
import { SplashScreen } from "@ionic-native/splash-screen";
import { Storage } from "@ionic/Storage";
import { SQLite, SQLiteObject } from "@ionic-native/sqlite";
import { LocationAccuracy } from "@ionic-native/location-accuracy";
import {
  BackgroundGeolocation,
  BackgroundGeolocationConfig,
  BackgroundGeolocationResponse,
  BackgroundGeolocationEvents
} from '@ionic-native/background-geolocation';

// import { NavigationBarColor } from 'ionic-plugin-navigation-bar-color';

import { LoginPage } from "../pages/login/login";
// import { HomePage } from "../pages/home/home";
import { ApplyserverPage } from "../pages/applyserver/applyserver";
import { HomePage } from "../pages/home/home";

@Component({ templateUrl: "app.html" })
export class MyApp {

  rootPage: any;

  checkGeolocation: any;
  datalocation: any;
  status: any;
  statusfake: any;

  constructor(
    public platform: Platform,
    public statusBar: StatusBar,
    public splashScreen: SplashScreen,
    private storage: Storage,
    private sqlite: SQLite,
    private locationAccuracy: LocationAccuracy,
    private backgroundGeolocation: BackgroundGeolocation,
    public zone: NgZone,
    public alertCtrl: AlertController,
    // public navigationBarColor: NavigationBarColor
  ) {

    // if run on mobile device, uncomment code below

    //azz on pc

    if (this.platform.is('android')) {
      console.log('Running on android');
      this.checkGPS();
      this.createdb();
    }

    // this.checkFakeGps();

    // end this comment

    this.platform.ready().then(() => {
      this.statusBar.backgroundColorByHexString("#ffffff");
      this.statusBar.styleDefault();
      // this.splashScreen.hide();
      // this.navigationBarColor.backgroundColorByHexString('#eeeee4');
    });

    this.storage.get("session_user_login").then((res) => {
      this.storage.get("server").then((res1) => {
        if (res == null && res1 == null) {
          this.rootPage = LoginPage;
        } else if (res != null && res1 == null) {
          this.rootPage = ApplyserverPage;
        } else {
          this.rootPage = HomePage;
        }
      });
    });

    // this.storage.get("session_user_login").then((res) => {
    //   if (res == null) {
    //     this.rootPage = LoginPage;
    //   } else {
    //     this.rootPage = ApplyserverPage;
    //     // this.rootPage = HomePage;
    //   }
    // });

    // this.storage.get("session_user_login").then((res) => {
    //   this.storage.get("server").then((res1) => {
    //     if (res == null && res1 == null) {
    //       this.rootPage = LoginPage;
    //     } else if (res != null && res1 == null) {
    //       this.rootPage = ApplyserverPage;
    //     } else {
    //       this.rootPage = HomePage;
    //     }
    //   });
    // });

  }

  checkGPS() {
    this.locationAccuracy.canRequest().then((canRequest: boolean) => {
      if (canRequest) {
        this.locationAccuracy.request(this.locationAccuracy.REQUEST_PRIORITY_HIGH_ACCURACY).then(() =>
          console.log("Request successful"), (error) => console.log("Error requesting location permissions", error));
      }
    });
  }

  checkFakeGps() {
    const config: BackgroundGeolocationConfig = {
      desiredAccuracy: 10,
      stationaryRadius: 20,
      distanceFilter: 30,
      notificationTitle: '',
      notificationText: '',
      // notificationsEnabled: false,
      // startForeground: false,
      debug: false, //  enable this hear sounds for background-geolocation life-cycle.
      stopOnTerminate: true // enable this to clear background location settings when the app terminates
    };
    this.backgroundGeolocation.configure(config).then(() => {
      this.checkGeolocation = this.backgroundGeolocation
        .on(BackgroundGeolocationEvents.location)
        .subscribe((location: BackgroundGeolocationResponse) => {

          this.zone.run(() => {
            this.datalocation = JSON.stringify(location);
            console.log(location);
          });

          if (location.isFromMockProvider == true) {

            console.log('Nama provider : ', location.provider);

            // this.statusfake = "Y";
            // this.status = "Fake GPS detected!";
            // const alert = this.alertCtrl.create({
            //   subTitle: 'We detected you using the Fake GPS application. Turn off the application immediately.',
            //   // buttons: ['OK']
            //   buttons: [
            //     {
            //       text: 'Oke',
            //       handler: () => {
            //         this.platform.exitApp();
            //         console.log('exiting app....')
            //       }
            //     }
            //   ]
            // });
            // alert.present();
            this.storage.set('fakegps', this.statusfake);
          } else {
            this.status = "";
            this.statusfake = "N";
            this.storage.set('fakegps', this.statusfake);
          }
        });
    });

    this.backgroundGeolocation.start();
  }

  createdb() {
    this.sqlite.create({ name: "vci_mobile.db", location: "default" }).then((db: SQLiteObject) => {
      // Buat tabel sqlite cek_in
      db.executeSql("CREATE TABLE IF NOT EXISTS cek_in \
                    (\
                      IdCekIn VARCHAR(50), \
                      KdSalesman VARCHAR(50), \
                      KdOutlet VARCHAR(50), \
                      NamaOutlet VARCHAR(100), \
                      TrueLocation VARCHAR(50), \
                      Latitude VARCHAR(50), \
                      Longitude VARCHAR(50), \
                      WaktuIn VARCHAR(50), \
                      WaktuOut VARCHAR(50), \
                      KdCabang VARCHAR(50), \
                      statuscekin VARCHAR(50), \
                      TglCheckIn DATE, \
                      send_status INTEGER \
                    )", []).then((res) => {
                      console.log("Success create cek_in", res)
      }).catch((e) => {
        console.log("Failed create cek_in", e)
      });

      // Buat tabel sqlite trans_so
      db.executeSql("CREATE TABLE IF NOT EXISTS trans_so \
                    (\
                      NoSO VARCHAR(50), \
                      TglSO DATE, \
                      KdSales VARCHAR(6), \
                      KdOutlet VARCHAR(10), \
                      NamaOutlet VARCHAR(100), \
                      TglPO DATE, \
                      TglExp DATE, \
                      UserName VARCHAR(50), \
                      PCode VARCHAR(50), \
                      NamaBarang VARCHAR(50), \
                      Netto VARCHAR(50), \
                      Netto2 VARCHAR(50), \
                      PersenDisc VARCHAR(5), \
                      RpDisc VARCHAR(50), \
                      Bruto VARCHAR(50), \
                      PPN VARCHAR(50), \
                      JBayar VARCHAR(50), \
                      Trm VARCHAR(50), \
                      Keterangan VARCHAR(50), \
                      AddDate VARCHAR(50), \
                      EditDate VARCHAR(50), \
                      KdGudang VARCHAR(50), \
                      Status_Kirim VARCHAR(50), \
                      InsertDate VARCHAR(50), \
                      KdCabang VARCHAR(50), \
                      KdDevice VARCHAR(50), \
                      send_status INTEGER \
                    )", []).then((res) => {
                      console.log("Success create trans_so", res)
      }).catch((e) => {
        console.log("Failed create  trans_so", e)
      });

      // Buat tabel sqlite trans_so_det
      db.executeSql("CREATE TABLE IF NOT EXISTS trans_so_det \
                      (\
                        NoSO VARCHAR(50), \
                        PCode VARCHAR(50), \
                        NamaBarang VARCHAR(50), \
                        Qty VARCHAR(50), \
                        Jenis VARCHAR(50), \
                        Jumlah VARCHAR(50), \
                        Netto VARCHAR(50), \
                        TradePromo VARCHAR(50), \
                        NamaPromo VARCHAR(50), \
                        Keterangan VARCHAR(50), \
                        AddDate VARCHAR(50), \
                        Editdate VARCHAR(50), \
                        KdGudang VARCHAR(50), \
                        KdCabang VARCHAR(50), \
                        send_status INTEGER \
                      )", []).then((res) => {
                        console.log("Success create trans_so_det", res)
      }).catch((e) => {
        console.log("Failed create  trans_so_det", e)
      });

      // Buat tabel sqlite trans_so_disc
      db.executeSql("CREATE TABLE IF NOT EXISTS trans_so_disc \
                      (\
                        NoSO VARCHAR(50), \
                        PCode VARCHAR(50), \
                        NamaBarang VARCHAR(50), \
                        PersenDisc1 VARCHAR(50), \
                        NilaiAwal VARCHAR(50), \
                        RpDisc VARCHAR(50), \
                        Nilai VARCHAR(50), \
                        PersenDiscAll VARCHAR(50), \
                        AddDate VARCHAR(50), \
                        EditDate VARCHAR(50), \
                        KdGudang VARCHAR(50), \
                        KdCabang VARCHAR(50), \
                        send_status INTEGER \
                      )", []).then((res) => {
                        console.log("Success create trans_so_disc", res)
      }).catch((e) => {
        console.log("Failed create  trans_so_disc", e)
      });
    });
  }
}
