import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { enviroment } from 'src/enviroments/enviroment';

@Injectable({
  providedIn: 'root'
})
export class RestaurantService {

  constructor(private http: HttpClient) { }

  createRestaurant(body: Object) {

    body = JSON.parse(JSON.stringify(body));

    return this.http.post(enviroment.host + '/restaurants', body); 
  }

  getRestaurant(id: String) {
    return this.http.get(enviroment.host + '/restaurants/' + id); 
  }

  getRestaurants() {
    return this.http.get(enviroment.host + '/restaurants'); 
  }

  updateRestaurant(id: String, body: Object) {
    
    body = JSON.parse(JSON.stringify(body));

    return this.http.put(enviroment.host + '/restaurants/' + id, body); 
  }

  deleteRestaurant(id: String) {
    return this.http.delete(enviroment.host + '/restaurants/' + id); 
  }

  filterRestaurants(type: String) {
    let body = JSON.parse(JSON.stringify({type: type}));

    return this.http.put(enviroment.host + '/restaurants/category', body);
  }

  searchRestaurants(filter: String) {
    return this.http.get(enviroment.host + '/restaurants/filter/' + filter); 
  }
}
