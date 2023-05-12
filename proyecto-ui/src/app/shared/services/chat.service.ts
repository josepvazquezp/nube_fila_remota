import { Injectable } from '@angular/core';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import { enviroment } from 'src/enviroments/enviroment';

@Injectable({
  providedIn: 'root'
})
export class ChatService {

  constructor(private http: HttpClient) { }

  createChat(body: String) {
    const headers = new HttpHeaders({ 'Content-Type': 'application/json'});
    return this.http.post(enviroment.host + '/chats/', body,  {headers} );
  }


  getChat(body: String) {
    const headers = new HttpHeaders({ 'Content-Type': 'application/json'});
    return this.http.post(enviroment.host + '/chats/find', body,  {headers} );
  }

  putMessage(body : string, id : String) {
    const headers = new HttpHeaders({ 'Content-Type': 'application/json'});
    return this.http.put(enviroment.host + '/chats/' + id, body, {headers});
  }

  getMyChats(body: String) {
    const headers = new HttpHeaders({ 'Content-Type': 'application/json'});
    return this.http.post(enviroment.host + '/chats/allmine', body,  {headers} );
  }


}
