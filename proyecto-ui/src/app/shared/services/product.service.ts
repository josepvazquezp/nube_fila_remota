import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { enviroment } from 'src/enviroments/enviroment';

@Injectable({
  providedIn: 'root'
})
export class ProductService {

  constructor(private http: HttpClient) { }

  createProduct(body: Object) {

    body = JSON.parse(JSON.stringify(body));

    return this.http.post(enviroment.host + '/products', body); 
  }

  getProduct(id: String) {
    return this.http.get(enviroment.host + '/products/' + id); 
  }

  updateProduct(id: String, body: Object) {

    body = JSON.parse(JSON.stringify(body));

    return this.http.put(enviroment.host + '/products/' + id, body); 
  }

  deleteProduct(id: String) {
    return this.http.delete(enviroment.host + '/products/' + id); 
  }

  searchProducts(filter: String) {
    return this.http.get('http://localhost:3000/products/filter/' + filter); 
  }

  changeImage(formData: FormData, id: string) {
    return this.http.post('http://localhost:3000/users/upload/' + id, formData);
  }
}
