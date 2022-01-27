//provider api

import { Injectable } from '@angular/core';
import { Http, Headers, RequestOptions } from '@angular/http';
import 'rxjs/add/operator/map';
import { Storage } from '@ionic/Storage';


@Injectable()
export class PostProvider {

	ip: any;
	link: any;

	// PC
	// server: string = "http://192.168.0.81/vci_mobile_api/index.php/mobile_vci_app/"
	// Laptpo
	// server: string = "http://192.168.43.51/vci_mobile_api/index.php/mobile_vci_app/"
	// Server 100
	// server: string = "http://app.vci.co.id:88/vci_mobile_api/index.php/mobile_vci_app/"
	// Server 100
	// server: string = "https://azz.vci.co.id/vci_mobile_api/index.php/mobile_vci_app/"

	constructor(public http: Http, private storage: Storage) {

		this.getIP();

	}

	getIP() {
		this.storage.get('server').then((res) => {
			this.ipaddress(res);
			console.log('Server address on PostPvdr', res)

		});
	}

	ipaddress(i) {
		this.ip = i;
		this.link = this.ip + '/vci_mobile_spg/index.php/mobile_vci_app/';
		// this.link = 'http://' + this.ip + '/vci_mobile_spg/index.php/mobile_vci_app/';
		console.log('IP Address (postPVDR) : ', this.ip);
		console.log('Link (postPVDR) : ', this.link);
	}

	postData(body, file) {

		// let type = "application/json; charset=UTF-8";
		let type = "application/x-www-form-urlencoded";
		let headers = new Headers({ 'Content-Type': type });
		let options = new RequestOptions({ headers: headers });

		return this.http.post(this.link + file, JSON.stringify(body), options).map(res => res.json());
		// return this.http.post("http://192.168.0.81/vci_mobile_api/index.php/mobile_vci_app/" + file, JSON.stringify(body), options).map(res => res.json());


	}

	postDataLogin(body, file) {

		// let type = "application/json; charset=UTF-8";
		let type = "application/x-www-form-urlencoded";
		let headers = new Headers({ 'Content-Type': type });
		let options = new RequestOptions({ headers: headers });

		return this.http.post("https://mobile1.vci.co.id/vci_mobile_spg/index.php/mobile_vci_app/" + file, JSON.stringify(body), options).map(res => res.json());
		// return this.http.post("https://app.vci.co.id:88/vci_mobile_api/index.php/mobile_vci_app/" + file, JSON.stringify(body), options).map(res => res.json());
		// return this.http.post("http://192.168.0.81/vci_mobile_api/index.php/mobile_vci_app/" + file, JSON.stringify(body), options).map(res => res.json());
		// return this.http.post("https://app.vci.co.id/" + file, JSON.stringify(body), options).map(res => res.json());

	}

	postDataRegtim(body, file) {

		// let type = "application/json; charset=UTF-8";
		let type = "application/x-www-form-urlencoded";
		let headers = new Headers({ 'Content-Type': type });
		let options = new RequestOptions({ headers: headers });

		return this.http.post("https://mobile1.vci.co.id/vci_mobile_spg/index.php/mobile_vci_app/" + file, JSON.stringify(body), options).map(res => res.json());
		// return this.http.post("https://mobile2.vci.co.id/vci_mobile_spg/index.php/mobile_vci_app/" + file, JSON.stringify(body), options).map(res => res.json());
		// return this.http.post("http://app.vci.co.id:888/vci_mobile_api/index.php/mobile_vci_app/" + file, JSON.stringify(body), options).map(res => res.json());
		// return this.http.post("http://192.168.0.81/vci_mobile_api/index.php/mobile_vci_app/" + file, JSON.stringify(body), options).map(res => res.json());
		// return this.http.post("https://app.vci.co.id/" + file, JSON.stringify(body), options).map(res => res.json());

	}


}