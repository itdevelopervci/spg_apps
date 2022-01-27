import { Component } from '@angular/core';
import { AlertController, IonicPage, LoadingController, NavController, NavParams, ToastController } from 'ionic-angular';
import { PostProvider } from '../../providers/post-provider';
import { CataloguedetailPage } from '../cataloguedetail/cataloguedetail';

@IonicPage()
@Component({
  selector: 'page-catalogue',
  templateUrl: 'catalogue.html',
})
export class CataloguePage {

  loader: any;
  list_catalogue: any;
  limit: any;
  offset: any;

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    public toastCtrl: ToastController,
    public alertCtrl: AlertController,
    public postPvdr: PostProvider,
    public loadingCtrl: LoadingController
  ) {

    this.getCatalogue();

  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad CataloguePage');
  }

  // ionViewDidEnter() {
  //   this.getCatalogue();
  // }

  openCatalogue(link, namabarang) {
    this.navCtrl.push(CataloguedetailPage, { image: link, namabarang: namabarang })
  }

  async presentLoading(x) {
    this.loader = await this.loadingCtrl.create({
      content: x,
    });
    return await this.loader.present();
  }

  getCatalogue() {
    this.limit = 10;
    this.offset = 0;
    this.presentLoading('Mohon tunggu');
    let body = {
      limit: this.limit,
      offset: this.offset,
      aksi: 'get_master_catalogue'
    };
    this.postPvdr.postData(body, 'Catalogue').subscribe((data) => {
      if (data.success) {
        this.loader.dismiss();
        this.list_catalogue = [];
        for (let i = 0; i < data.result.length; i++) {
          this.list_catalogue.push({
            'PCode': data.result[i].PCode,
            'NamaBarang': data.result[i].NamaBarang,
            'image_small': data.result[i].image_small,
            'image_large': data.result[i].image_large
          });
          // console.log(data.result[i].image_large);
        }
      }
    }, error => {
      this.loader.dismiss();
      const confirm = this.alertCtrl.create({
        message: 'Koneksi internet terputus, silahkan muat ulang atau coba lagi beberapa saat.',
        buttons: [
          {
            text: 'Tutup',
            handler: () => {
              console.log('Disagree clicked');
            }
          },
          {
            text: 'Muat ulang',
            handler: () => {
              console.log('Agree clicked');
              this.getCatalogue();
            }
          }
        ]
      });
      confirm.present();
    });

  }

  doInfinite(infiniteScroll) {
    setTimeout(() => {
      this.offset = this.offset + this.limit;
      let body = {
        limit: this.limit,
        offset: this.offset,
        aksi: 'get_master_catalogue'
      };
      this.postPvdr.postData(body, 'Catalogue').subscribe((data) => {
        if (data.success) {
          infiniteScroll.complete();
          for (let i = 0; i < data.result.length; i++) {
            this.list_catalogue.push({
              'PCode': data.result[i].PCode,
              'NamaBarang': data.result[i].NamaBarang,
              'image_small': data.result[i].image_small,
              'image_large': data.result[i].image_large
            });
          }
        }
      }, error => {
        this.loader.dismiss();
        const confirm = this.alertCtrl.create({
          message: 'Koneksi internet terputus, silahkan muat ulang atau coba lagi beberapa saat.',
          buttons: [
            {
              text: 'Tutup',
              handler: () => {
                console.log('Disagree clicked');
              }
            },
            {
              text: 'Muat ulang',
              handler: () => {
                console.log('Agree clicked');
                this.getCatalogue();
              }
            }
          ]
        });
        confirm.present();
      });
    }, 1000);
  }

}
