import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class LoginService {

  constructor(private httpClient: HttpClient) { }

  login(body: Object): Observable<any> {
    return this.httpClient.post('http://localhost:3000/users/login', JSON.parse(JSON.stringify(body)));
  }

  googleLogin(idToken: string): Observable<any> {
    const url = 'http://localhost:3000/users/login/google';
    
    return this.httpClient.post(url, { googleToken: idToken });
  }
  
}
