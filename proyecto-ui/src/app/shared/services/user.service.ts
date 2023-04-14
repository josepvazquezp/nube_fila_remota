import { Injectable } from '@angular/core';
import {HttpClient} from '@angular/common/http';

import {enviroment} from 'src/enviroments/enviroment';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  constructor(private http: HttpClient) { }

  getUsers() {
    return this.http.get('http://localhost:3000/users'); // Reemplaza la URL con la ruta de Express Laneta no sé donde xd
  }

  postUsers() {
    
    //return this.http.post('http://localhost:3000/users'); // Reemplaza la URL con la ruta de Express Laneta no sé donde xd
  }


}
