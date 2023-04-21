import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class ProductService {

  constructor(private http: HttpClient) { }

  createProduct(body: Object) {

    body = JSON.parse(JSON.stringify(body));

    return this.http.post('http://localhost:3000/products', body); 
  }

  getProduct(id: String) {
    return this.http.get('http://localhost:3000/products/' + id); 
  }

  updateProduct(id: String, body: Object) {

    body = JSON.parse(JSON.stringify(body));

    return this.http.put('http://localhost:3000/products/' + id, body); 
  }

  deleteProduct(id: String) {
    return this.http.delete('http://localhost:3000/products/' + id); 
  }
}
