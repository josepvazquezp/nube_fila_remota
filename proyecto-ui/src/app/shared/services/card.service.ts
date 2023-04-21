import { Injectable } from '@angular/core';
import {HttpClient, HttpHeaders} from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class CardService {

  constructor(private http: HttpClient) { }

  getCards(user: String) {
    return this.http.get('http://localhost:3000/cards/looku/' + user);
  }

  getOneCard(id : String) {
    return this.http.get('http://localhost:3000/cards/' + id);
  }

  postCard(body : string) {
    const headers = new HttpHeaders({ 'Content-Type': 'application/json'});
    return this.http.post('http://localhost:3000/cards', body, {headers});
  }

  putCard(body : string, id : String) {
    const headers = new HttpHeaders({ 'Content-Type': 'application/json'});
    return this.http.put('http://localhost:3000/cards/' + id, body, {headers});
  }

  deleteCard(id : String) {
    return this.http.delete('http://localhost:3000/cards/' + id);
  }


  getCardCreate(number: string){
    return this.http.get('http://localhost:3000/cards/lookc/' + number);
  }

 
}
