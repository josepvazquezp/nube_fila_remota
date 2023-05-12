import { Injectable } from '@angular/core';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import { enviroment } from 'src/enviroments/enviroment';

@Injectable({
  providedIn: 'root'
})
export class CardService {

  constructor(private http: HttpClient) { }

  getCards(user: String) {
    return this.http.get(enviroment.host + '/cards/looku/' + user);
  }

  getOneCard(id : String) {
    return this.http.get(enviroment.host + '/cards/' + id);
  }

  postCard(body : string) {
    const headers = new HttpHeaders({ 'Content-Type': 'application/json'});
    return this.http.post(enviroment.host + '/cards', body, {headers});
  }

  putCard(body : string, id : String) {
    const headers = new HttpHeaders({ 'Content-Type': 'application/json'});
    return this.http.put(enviroment.host + '/cards/' + id, body, {headers});
  }

  deleteCard(id : String) {
    return this.http.delete(enviroment.host + '/cards/' + id);
  }


  getCardCreate(number: string){
    return this.http.get(enviroment.host + '/cards/lookc/' + number);
  }

 
}
