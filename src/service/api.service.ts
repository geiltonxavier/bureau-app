import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { catchError, tap } from 'rxjs/operators';
import { Product } from 'src/model/product';
import { TokenInfo } from 'src/model/tokenInfo';
import { ToastrService } from 'ngx-toastr';

const httpOptions = {
  headers: new HttpHeaders(
    {
      'Content-Type': 'application/json'
    })
};

const apiUrl = 'http://localhost:52081/api';

@Injectable({
  providedIn: 'root'
})
export class ApiService {

  constructor(private http: HttpClient, private toastrService: ToastrService) { }

  getProducts(): Observable<Product[]> {

    let accessToken = null;
    if (localStorage.getItem("token") !== null) {
      let token = JSON.parse(localStorage.getItem('token')) as TokenInfo;
      accessToken = token.accessToken;
    }

    return this.http.get<Product[]>(`${apiUrl}/products`, { headers: new HttpHeaders({ 'Authorization': 'Bearer ' + accessToken }) })
      .pipe(catchError(this.handleError('getProducts', []))
      )
  }

  login(): Observable<TokenInfo> {
    var body = { "userName": "admin", "password": "admin" };

    return this.http.post(`${apiUrl}/login`, JSON.stringify(body), httpOptions).pipe(
      tap((tokenInfo: TokenInfo) => {
        localStorage.clear()
        localStorage.setItem('token', JSON.stringify(tokenInfo));
      }),
      catchError(this.handleError<TokenInfo>('login'))
    );
  }

  private handleError<T>(operation = 'operation', result?: T) {
    return (error: any): Observable<T> => {

      if (error.status === 401) {
        this.toastrService.info('Sua sessão expirou');
      } else {
        console.error(error);
      }

      return of(result as T);
    };
  }
}
