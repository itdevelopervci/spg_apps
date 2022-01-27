import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { Storage } from '@ionic/Storage';
import { CutiPage } from '../cuti/cuti';
import { DatangterlambatPage } from '../datangterlambat/datangterlambat';
import { TidakmencatatkehadiranPage } from '../tidakmencatatkehadiran/tidakmencatatkehadiran';
import { FingerlessPage } from '../fingerless/fingerless';
import { PresensihistoriPage } from '../presensihistori/presensihistori';


@IonicPage()
@Component({
  selector: 'page-presensi',
  templateUrl: 'presensi.html',
})
export class PresensiPage {

  presensi_type: any;
  type_id: any;

  slideData = [
    { image: "assets/imgs/presensi_a.png" },
    { image: "assets/imgs/presensi_b.png" }
  ]


  constructor(public navCtrl: NavController, public navParams: NavParams, private storage: Storage) {
    this.getType();
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad PresensiPage');
  }

  getType() {

    this.storage.get('master_presensi').then((res) => {
      this.presensi_type = [];
      for (let i = 0; i < res.length; i++) {
        this.presensi_type.push(
          {
            'type_id': res[i]['type_id'],
            'type_name': res[i]['type_name']
          }
        )
      }

      console.log("Form Presensi Type", res);

    });

  }

  openPresensiForm(type_id) {
    console.log('type_id: ', type_id);
    if (type_id == 4) {
      this.navCtrl.push(CutiPage, { type_id: type_id });
    } else if (type_id == 11) {
      this.navCtrl.push(DatangterlambatPage, { type_id: type_id });
    } else if (type_id == 12) {
      this.navCtrl.push(TidakmencatatkehadiranPage, { type_id: type_id });
    } else if (type_id == 20) {
      this.navCtrl.push(FingerlessPage, { type_id: type_id });
    }
  }

  historyPresensi() {
    // this.navCtrl.push(PresensihistoriPage, {}, { animation: 'ios-transition' });
    this.navCtrl.push(PresensihistoriPage);
  }

}
