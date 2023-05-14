import { Injectable } from '@angular/core';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import { enviroment } from 'src/enviroments/enviroment';

@Injectable({
  providedIn: 'root'
})
export class ReviewService {

  constructor(private http: HttpClient) { }

  createRating(body: String) {
    const headers = new HttpHeaders({ 'Content-Type': 'application/json'});
    return this.http.post(enviroment.host + '/ratings/', body,  {headers} );
  }

  getRatingR(id: String) {
    return this.http.get(enviroment.host + '/ratings/mineR/' + id);
  }
}
