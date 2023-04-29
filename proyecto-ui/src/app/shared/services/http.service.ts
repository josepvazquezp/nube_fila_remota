import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';

import { AuthService } from './auth.service';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class HttpService {
  constructor(private httpClient: HttpClient, private authService: AuthService) { }

  get(url: string): Observable<any> {
    const headers = new HttpHeaders({
      'Authorization': this.authService.getToken()
    });

    return this.httpClient.get(url, { headers });
  } 
  
  post(url: string, body: Object) {
    const headers = new HttpHeaders({
      'Authorization': this.authService.getToken()
    });

    return this.httpClient.post(url, { headers, body });
  }

  put(url: string, body: Object) {
    const headers = new HttpHeaders({
      'Authorization': this.authService.getToken()
    });

    return this.httpClient.post(url, { headers, body });
  }
}
