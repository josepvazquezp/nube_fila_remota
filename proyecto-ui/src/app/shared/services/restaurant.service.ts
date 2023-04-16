import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class RestaurantService {

  constructor(private http: HttpClient) { }

  createRestaurant(body: Object) {

    body = JSON.parse(JSON.stringify(body));

    return this.http.post('http://localhost:3000/restaurants', body); 
  }

  getRestaurant(id: String) {
    return this.http.get('http://localhost:3000/restaurants/' + id); 
  }

  getRestaurants() {
    return this.http.get('http://localhost:3000/restaurants'); 
  }

  updateRestaurant(id: String, image: String, description: String) {
    let body = {};

    if(image == null && description != '') {
      body = {description: description};
    }
    else if(image != null && description == '') {
      body = {image: image};
    }
    else {
      body = {description: description, image: image}
    }

    body = JSON.parse(JSON.stringify(body));

    return this.http.put('http://localhost:3000/restaurants/' + id, body); 
  }

  deleteRestaurant(id: String) {
    return this.http.delete('http://localhost:3000/restaurants/' + id); 
  }
}
