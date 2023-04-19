import { Injectable } from '@angular/core';
import {HttpClient, HttpHeaders} from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class ChatService {

  constructor(private http: HttpClient) { }

  getChat(body: String) {
    const headers = new HttpHeaders({ 'Content-Type': 'application/json'});
    return this.http.post('http://localhost:3000/chats/mine', body,  {headers} );
  }

  putMessage(body : string, id : String) {
    const headers = new HttpHeaders({ 'Content-Type': 'application/json'});
    return this.http.put('http://localhost:3000/chats/' + id, body, {headers});
  }

}
