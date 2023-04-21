import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class OrderService {

  constructor(private http: HttpClient) { }

  createOrder(body: Object) {

    body = JSON.parse(JSON.stringify(body));

    return this.http.post('http://localhost:3000/orders', body); 
  }

  getOrder(id: String) {
    return this.http.get('http://localhost:3000/orders/' + id); 
  }

  updateOrder(id: String, body: Object) {

    body = JSON.parse(JSON.stringify(body));

    return this.http.put('http://localhost:3000/orders/' + id, body); 
  }

  deleteOrder(id: String) {
    return this.http.delete('http://localhost:3000/orders/' + id); 
  }
}
