import { Injectable } from '@angular/core';
import {HttpClient, HttpHeaders} from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class ReviewService {

  constructor(private http: HttpClient) { }

  createRating(body: String) {
    const headers = new HttpHeaders({ 'Content-Type': 'application/json'});
    return this.http.post('http://localhost:3000/ratings/', body,  {headers} );
  }
}
