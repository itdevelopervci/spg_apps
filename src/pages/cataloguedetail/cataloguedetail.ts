import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';

/**
 * Generated class for the CataloguedetailPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-cataloguedetail',
  templateUrl: 'cataloguedetail.html',
})
export class CataloguedetailPage {

  image: any;
  namabarang: any;

  constructor(public navCtrl: NavController, public navParams: NavParams) {

    this.getCurrentData(navParams.get('image'), navParams.get('namabarang'));

  }

  getCurrentData(image, namabarang) {
    this.image = image;
    this.namabarang = namabarang;
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad CataloguedetailPage');
  }

}
