import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { enviroment } from 'src/enviroments/enviroment';

@Injectable({
  providedIn: 'root'
})
export class OrderService {

  constructor(private http: HttpClient) { }

  createOrder(body: Object) {

    body = JSON.parse(JSON.stringify(body));

    return this.http.post(enviroment.host + '/orders', body); 
  }

  getOrder(id: String) {
    return this.http.get(enviroment.host + '/orders/' + id); 
  }

  updateOrder(id: String, body: Object) {

    body = JSON.parse(JSON.stringify(body));

    return this.http.put(enviroment.host + '/orders/' + id, body); 
  }

  deleteOrder(id: String) {
    return this.http.delete(enviroment.host + '/orders/' + id); 
  }
}
