import { Component, ElementRef, ViewChild } from '@angular/core';
import { IonicPage, NavController, NavParams, AlertController, LoadingController, ToastController } from 'ionic-angular';
import { Storage } from '@ionic/Storage';
import { PostProvider } from '../../providers/post-provider';



@IonicPage()
@Component({
  selector: 'page-tidakmencatatkehadiran',
  templateUrl: 'tidakmencatatkehadiran.html',
})
export class TidakmencatatkehadiranPage {

  @ViewChild('myInput') myInput: ElementRef;

  public waktu_datang = {
    timeStarts: '08:00'
  }

  public waktu_pulang = {
    timeEnds: '17.00'
  }

  startDate: String = new Date().toISOString();

  keterangan: String;

  tipe_lupa_absen: any;
  pilih_tanggal: any;
  today: any;
  type_id: any;
  employee_id: any;
  username: any;
  id_atasan: any;
  id_hrd_cabang: any;
  loader: any;



  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    private storage: Storage,
    public alertCtrl: AlertController,
    public postPvdr: PostProvider,
    public loadingCtrl: LoadingController,
    public toastCtrl: ToastController
  ) {

    this.pilih_tanggal = this.startDate.substr(0, 10);
    this.today = this.startDate.substr(0, 10);
    this.getCurrentData(navParams.get('type_id'));
    this.getData();

  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad TidakmencatatkehadiranPage');
  }

  async presentLoading() {
    this.loader = await this.loadingCtrl.create({
      content: "",
      duration: 2000
    });
    return await this.loader.present();
  }

  getCurrentData(type_id) {
    this.type_id = type_id;
  }

  getData() {
    this.storage.get('session_user_login').then((res) => {
      this.employee_id = res[0].employee_id;
      this.username = res[0].username;
      this.id_atasan = res[0].id_atasan;
      this.id_hrd_cabang = res[0].id_hrd_cabang;
    });
  }

  resize() {
    var element = this.myInput['_elementRef'].nativeElement.getElementsByClassName("text-input")[0];
    var scrollHeight = element.scrollHeight;
    element.style.height = scrollHeight + 'px';
    this.myInput['_elementRef'].nativeElement.style.height = (scrollHeight + 16) + 'px';
  }

  pilih_tipe_LA($event) {
    this.tipe_lupa_absen = $event;
    console.log("tipe LA:", this.tipe_lupa_absen);
    document.getElementById('waktu').style.display = '';
    document.getElementById('button_send').style.display = '';
    document.getElementById('keterangan').style.display = '';
    if (this.tipe_lupa_absen == 1) {
      document.getElementById('waktu_datang').style.display = '';
      document.getElementById('waktu_pulang').style.display = 'none';
    } else if (this.tipe_lupa_absen == 2) {
      document.getElementById('waktu_datang').style.display = 'none';
      document.getElementById('waktu_pulang').style.display = '';
    } else {
      document.getElementById('waktu').style.display = 'none';
    }
  }

  pilihtanggal($event) {
    this.pilih_tanggal = this.startDate.substr(0, 10);
    console.log("tanggal:", this.pilih_tanggal);
    if (this.pilih_tanggal > this.today) {
      const alert = this.alertCtrl.create({
        title: 'Perhatian!',
        subTitle: 'Tanggal melebihi tanggal hari ini.',
        buttons: ['OK']
      });
      alert.present();
    }
  }

  send_data() {

    console.log('employee_id : ', this.employee_id);
    console.log('username : ', this.username);
    console.log('id_atasan : ', this.id_atasan);
    console.log('id_hrd_cabang : ', this.id_hrd_cabang);
    console.log('Tanggal Submit : ', this.today);
    console.log('Tanggal : ', this.pilih_tanggal);
    console.log('Tipe ID : ', this.type_id);
    console.log('Tipe Absen: ', this.tipe_lupa_absen);
    console.log('Jam : ', this.waktu_datang.timeStarts);
    console.log('Keterangan : ', this.keterangan);

    if (this.keterangan == '' || this.keterangan == null) {
      const alert = this.alertCtrl.create({
        title: 'Perhatian!',
        subTitle: 'Keterangan harus diisi!.',
        buttons: ['OK']
      });
      alert.present();
    } else {

      let body = {
        employee_id: this.employee_id,
        submit_date: this.today,
        type_id: this.type_id,
        date_from: this.pilih_tanggal,
        date_to: this.pilih_tanggal,
        time_from: this.waktu_datang.timeStarts,
        remarks: this.keterangan,
        author_user: this.username,
        edited_user: this.username,
        approval_1_employee_id: this.id_atasan,
        approval_2_employee_id: this.id_hrd_cabang,
        type_la: this.tipe_lupa_absen,
        aksi: 'insert_presensi_lupa_absen'
      };

      this.presentLoading();
      this.postPvdr.postData(body, 'PresensiPersonal').subscribe((data) => {

        if (data.success) {

          this.loader.dismiss();

          const toast = this.toastCtrl.create({
            message: 'Data Berhasil Dikirim',
            duration: 3000,
            position: 'top'
          });
          toast.present();

          this.navCtrl.pop();

        } else {

          this.loader.dismiss();
          const toast = this.toastCtrl.create({
            message: 'Data Gagal Terkirim',
            duration: 3000,
            position: 'top'
          });
          toast.present();

        }

      }, error => {

        this.loader.dismiss();
        const alert = this.alertCtrl.create
          ({

            title: 'Pehatian',
            subTitle: 'Internet tidak tersambung, cek kembali signal atau kuota internet Anda.',
            buttons: ['OK']

          });
        alert.present();
      });

    }

  }

}
