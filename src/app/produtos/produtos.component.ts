import { Component, OnInit } from '@angular/core';
import { Product } from 'src/model/product';
import { ApiService } from 'src/service/api.service';

@Component({
  selector: 'app-produtos',
  templateUrl: './produtos.component.html',
  styleUrls: ['./produtos.component.scss']
})
export class ProdutosComponent {
  displayedColumns: string[] = ['productId', 'name','description', 'category', 'price'];
  dataSource: Product[];
  token: string;
  isLoadingResults = true;

  timeLeft: string;
  seconds: number = 0
  interval;

  constructor(private _api: ApiService) { }


  getProducts() {
    this._api.getProducts()
      .subscribe(res => {
        this.dataSource = res;
        this.isLoadingResults = false;
      }, err => {
        this.isLoadingResults = false;
      });
  }

  login() {
    this._api.login()
      .subscribe(res => {
        this.token = res.accessToken;
        this.startTimer(res.created, res.expiration);
      }, (err) => {
        console.log(err);
      }
      );
  }

  startTimer(created, expiration) {
    created = new Date(Date.parse(created));
    expiration = new Date(Date.parse(expiration));
    this.seconds = Math.floor((expiration.getTime() - created.getTime()) / 1000);
    clearInterval(this.interval);
    this.interval = setInterval(() => {
      if (this.seconds > 0) {
        this.seconds--;
        this.timeLeft = this.secondsToHms(this.seconds);
      } else {
        this.timeLeft = this.secondsToHms(0);
      }
    }, 1000)
  }

  secondsToHms(d) {
    d = Number(d);
    var h = Math.floor(d / 3600);
    var m = Math.floor(d % 3600 / 60);
    var s = Math.floor(d % 3600 % 60);

    var hDisplay = h > 0 ? h + (h == 1 ? " hora, " : " horas, ") : "";
    var mDisplay = m > 0 ? m + (m == 1 ? " minuto e " : " minutos e ") : "";
    var sDisplay = s > 0 ? s + (s == 1 ? " segundo" : " segundos") : "";
    return hDisplay + mDisplay + sDisplay;
  }

}
