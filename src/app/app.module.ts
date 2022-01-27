import { BrowserModule } from '@angular/platform-browser';
import { ErrorHandler, NgModule } from '@angular/core';
import { IonicApp, IonicErrorHandler, IonicModule } from 'ionic-angular';
import { SplashScreen } from '@ionic-native/splash-screen';
import { StatusBar } from '@ionic-native/status-bar';
import { Toast } from '@ionic-native/toast';
import { SQLite } from '@ionic-native/sqlite';
import { NavigationBarColor } from 'ionic-plugin-navigation-bar-color';

import { HttpModule } from '@angular/http';
import { IonicStorageModule } from '@ionic/Storage';
import { PostProvider } from '../providers/post-provider';
import { BarcodeScanner } from '@ionic-native/barcode-scanner';
import { LocationAccuracy } from '@ionic-native/location-accuracy';
import { Geolocation } from '@ionic-native/geolocation';
import { ScreenOrientation } from '@ionic-native/screen-orientation';
import { BackgroundGeolocation } from '@ionic-native/background-geolocation';
import { AppVersion } from '@ionic-native/app-version';
import { InAppBrowser } from '@ionic-native/in-app-browser';

import { MyApp } from './app.component';
import { HomePage } from '../pages/home/home';
import { LoginPage } from '../pages/login/login';
import { PresensiPage } from '../pages/presensi/presensi';
import { SalesmanPage } from '../pages/salesman/salesman';
import { DistributionPage } from '../pages/distribution/distribution';
import { MarketingPage } from '../pages/marketing/marketing';
import { CutiPage } from '../pages/cuti/cuti';
import { DatangterlambatPage } from '../pages/datangterlambat/datangterlambat';
import { TidakmencatatkehadiranPage } from '../pages/tidakmencatatkehadiran/tidakmencatatkehadiran';
import { FingerlessPage } from '../pages/fingerless/fingerless';
import { PresensihistoriPage } from '../pages/presensihistori/presensihistori';
import { MenusalesmanPage } from '../pages/menusalesman/menusalesman';
import { KunjunganPage } from '../pages/kunjungan/kunjungan';
import { OutletPage } from '../pages/outlet/outlet';
import { PilihoutletPage } from '../pages/pilihoutlet/pilihoutlet';
import { CheckinPage } from '../pages/checkin/checkin';
import { ProdukPage } from '../pages/produk/produk';
import { TambahprodukPage } from '../pages/tambahproduk/tambahproduk';
import { TambahprodukdetailPage } from '../pages/tambahprodukdetail/tambahprodukdetail';
import { HistorycheckinPage } from '../pages/historycheckin/historycheckin';
import { HistorytransPage } from '../pages/historytrans/historytrans';
import { HistorytransdetailPage } from '../pages/historytransdetail/historytransdetail';
import { PagetestPage } from '../pages/pagetest/pagetest';
import { HistorydetailcheckinPage } from '../pages/historydetailcheckin/historydetailcheckin';
import { HistorytranspendingdetailPage } from '../pages/historytranspendingdetail/historytranspendingdetail';
import { OtorisasiPage } from '../pages/otorisasi/otorisasi';
import { OtorisasihistoryPage } from '../pages/otorisasihistory/otorisasihistory';
import { AdditionalordersPage } from '../pages/additionalorders/additionalorders';
import { VisitapprovalPage } from '../pages/visitapproval/visitapproval';
import { ChecktransPage } from '../pages/checktrans/checktrans';
import { CheckvisitPage } from '../pages/checkvisit/checkvisit';
import { MapsviewerPage } from '../pages/mapsviewer/mapsviewer';
import { CheckvisitdetailPage } from '../pages/checkvisitdetail/checkvisitdetail';
import { ApplyserverPage } from '../pages/applyserver/applyserver';
import { CheckrecaptransPage } from '../pages/checkrecaptrans/checkrecaptrans';
import { CataloguePage } from '../pages/catalogue/catalogue';
import { CataloguedetailPage } from '../pages/cataloguedetail/cataloguedetail';
import { SelloutPage } from '../pages/sellout/sellout';

@NgModule({
  declarations: [
    MyApp,
    HomePage,
    LoginPage,
    PresensiPage,
    SalesmanPage,
    DistributionPage,
    MarketingPage,
    CutiPage,
    DatangterlambatPage,
    TidakmencatatkehadiranPage,
    FingerlessPage,
    PresensihistoriPage,
    MenusalesmanPage,
    KunjunganPage,
    OutletPage,
    PilihoutletPage,
    CheckinPage,
    ProdukPage,
    TambahprodukPage,
    TambahprodukdetailPage,
    HistorycheckinPage,
    HistorydetailcheckinPage,
    HistorytransPage,
    HistorytransdetailPage,
    PagetestPage,
    HistorytranspendingdetailPage,
    OtorisasiPage,
    OtorisasihistoryPage,
    AdditionalordersPage,
    VisitapprovalPage,
    ChecktransPage,
    CheckvisitPage,
    MapsviewerPage,
    CheckvisitdetailPage,
    ApplyserverPage,
    CheckrecaptransPage,
    CataloguePage,
    CataloguedetailPage,
    SelloutPage
  ],
  imports: [
    BrowserModule,
    HttpModule,
    IonicStorageModule.forRoot(),
    // IonicModule.forRoot(MyApp)
    IonicModule.forRoot(MyApp, {
      // animated: false,
      rippleEffect: false,
      mode: 'md'
    }),
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp,
    HomePage,
    LoginPage,
    PresensiPage,
    SalesmanPage,
    DistributionPage,
    MarketingPage,
    CutiPage,
    DatangterlambatPage,
    TidakmencatatkehadiranPage,
    FingerlessPage,
    PresensihistoriPage,
    MenusalesmanPage,
    KunjunganPage,
    OutletPage,
    PilihoutletPage,
    CheckinPage,
    ProdukPage,
    TambahprodukPage,
    TambahprodukdetailPage,
    HistorycheckinPage,
    HistorydetailcheckinPage,
    HistorytransPage,
    HistorytransdetailPage,
    PagetestPage,
    HistorytranspendingdetailPage,
    OtorisasiPage,
    OtorisasihistoryPage,
    AdditionalordersPage,
    VisitapprovalPage,
    ChecktransPage,
    CheckvisitPage,
    MapsviewerPage,
    CheckvisitdetailPage,
    ApplyserverPage,
    CheckrecaptransPage,
    CataloguePage,
    CataloguedetailPage,
    SelloutPage
  ],
  providers: [
    StatusBar,
    SplashScreen,
    PostProvider,
    BarcodeScanner,
    LocationAccuracy,
    Geolocation,
    Toast,
    SQLite,
    ScreenOrientation,
    BackgroundGeolocation,
    AppVersion,
    InAppBrowser,
    NavigationBarColor,
    { provide: ErrorHandler, useClass: IonicErrorHandler }
  ]
})
export class AppModule { }
