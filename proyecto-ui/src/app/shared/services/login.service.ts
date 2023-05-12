import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { Observable } from 'rxjs';
import { enviroment } from 'src/enviroments/enviroment';

@Injectable({
  providedIn: 'root'
})
export class LoginService {

  constructor(private httpClient: HttpClient) { }

  login(body: Object): Observable<any> {
    return this.httpClient.post(enviroment.host + '/users/login', JSON.parse(JSON.stringify(body)));
  }

  googleLogin(idToken: string): Observable<any> {
    const url = enviroment.host + '/users/login/google';
    
    return this.httpClient.post(url, { googleToken: idToken });
  }
  
}
