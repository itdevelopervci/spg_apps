import { Component, ViewChild } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { Storage } from '@ionic/Storage';
import { CupertinoPane } from 'cupertino-pane';
import chartJs from 'chart.js';
import { OtorisasiPage } from '../otorisasi/otorisasi';

@IonicPage()
@Component({
  selector: 'page-distribution',
  templateUrl: 'distribution.html',
})
export class DistributionPage {

  @ViewChild('barCanvas') barCanvas;
  @ViewChild('pieCanvas') pieCanvas;

  distMenuPane: any;
  name: any;
  barChart: any;
  pieChart: any;

  date: String = new Date().toISOString();
  monthnow: any;
  yearnow: any;

  constructor(
    public navCtrl: NavController,
    public storage: Storage,
    public navParams: NavParams) {


  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad DistributionPage');
  }

  ionViewDidEnter() {

    console.log('ionViewDidEnter DistributionPage');
    this.monthnow = this.date.substring(5, 7)
    this.yearnow = this.date.substring(0, 4)
    // this.showMenuPane();
    // this.storage.get('session_user_login').then((res) => {
    //   this.name = res[0].employee_name;
    //   console.log(this.name);
    // });
  }

  ionViewDidLeave() {
    // this.closeMenuPane();
  }

  ngAfterViewInit() {
    setTimeout(() => {
      this.barChart = this.getBarChart();
      this.pieChart = this.getPieChart();
    }, 1)
  }

  getChart(context, chartType, data, options?) {
    return new chartJs(context, {
      data,
      options,
      type: chartType
    })
  }

  getBarChart() {
    const datas = {
      labels: ['JK1', 'JK2', 'BDG', 'SMG', 'SBY', 'DPS', 'RBAR', 'RTIM'],
      datasets: [
        {
          label: 'Pencapaian ',
          data: [12, 23, 15, 50, 25, 25, 66, 43],
          backgroundColor: [
            'rgba(207, 0, 15, 0.7)',
            'rgba(207, 0, 15, 0.7)',
            'rgba(207, 0, 15, 0.7)',
            'rgba(207, 0, 15, 0.7)',
            'rgba(207, 0, 15, 0.7)',
            'rgba(207, 0, 15, 0.7)',
            'rgba(207, 0, 15, 0.7)',
            'rgba(207, 0, 15, 0.7)'
          ],
          borderWidth: 1,
          barThickness: 25,
        },
        {
          label: 'Target',
          data: [19, 29, 19, 70, 58, 50, 80, 60],
          backgroundColor: [
            'rgba(149, 165, 166, 0.5)',
            'rgba(149, 165, 166, 0.5)',
            'rgba(149, 165, 166, 0.5)',
            'rgba(149, 165, 166, 0.5)',
            'rgba(149, 165, 166, 0.5)',
            'rgba(149, 165, 166, 0.5)',
            'rgba(149, 165, 166, 0.5)',
            'rgba(149, 165, 166, 0.5)'
          ],
          borderWidth: 1,
          barThickness: 25,
        },

      ]
    };

    const options = {
      scales: {
        yAxes: [{
          ticks: {
            beginAtZero: true,
            stacked: true
          }
        }],
        xAxes: [{
          stacked: true,
          ticks: {
            fontSize: 10
          }
        }]
      }
    }

    return this.getChart(this.barCanvas.nativeElement, 'bar', datas, options);
  }

  getPieChart() {
    const data = {
      labels: ['Vermelho', 'Azul', 'Amarelo'],
      datasets: [{
        data: [300, 75, 224],
        backgroundColor: ['rgb(200, 6, 0)', 'rgb(36, 0, 255)', 'rgb(242, 255, 0)']
      }]
    }
    return this.getChart(this.pieCanvas.nativeElement, 'pie', data);
  }

  showMenuPane() {
    this.distMenuPane = new CupertinoPane(
      '.dist-cupertino-pane', // Pane container selector
      {
        parentElement: 'body', // Parent container
        breaks: {
          top: { enabled: true, height: 600, bounce: true },
          middle: { enabled: true, height: 480, bounce: true },
          bottom: { enabled: false, height: 80 },
        },
        buttonClose: false,
        clickBottomOpen: true,
        backdrop: true,
        backdropOpacity: 0.4,
        initialBreak: 'middle'
      }
    );
    this.distMenuPane.present({ animate: true });
  }

  closeMenuPane() {
    this.distMenuPane.destroy({ animate: true });
  }

  goToOtorisasiPage() {
    this.navCtrl.push(OtorisasiPage);
  }

  showFilter() {
    document.getElementById('filter_on').style.display = 'none';
    document.getElementById('grafik').style.display = 'none';
    document.getElementById('filter_off').style.display = '';
    document.getElementById('div_filter').style.display = '';
  }

  hideFilter() {
    document.getElementById('filter_on').style.display = '';
    document.getElementById('grafik').style.display = '';
    document.getElementById('filter_off').style.display = 'none';
    document.getElementById('div_filter').style.display = 'none';
  }





}
