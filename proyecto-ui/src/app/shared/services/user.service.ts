import { Injectable } from '@angular/core';
import {HttpClient, HttpHeaders} from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  constructor(private http: HttpClient) { }

  getUsers() {
    return this.http.get('http://localhost:3000/users');
  }

  getOneUser(id : String) {
    return this.http.get('http://localhost:3000/users/' + id);
  }

  postUsers(body : string) {
    const headers = new HttpHeaders({ 'Content-Type': 'application/json'});
    return this.http.post('http://localhost:3000/users', body, {headers});
  }

  putUser(body : string, id : String) {
    const headers = new HttpHeaders({ 'Content-Type': 'application/json'});
    return this.http.put('http://localhost:3000/users/' + id, body, {headers});
  }

  deleteUser(id : String) {
    return this.http.delete('http://localhost:3000/users/' + id);
  }

  getUserCreate(email: string){
    return this.http.get('http://localhost:3000/users/look/' + email);
  }

  getUserLogin(body : string) {
    const headers = new HttpHeaders({ 'Content-Type': 'application/json'});
    return this.http.post('http://localhost:3000/users/login', body, {headers});
  }


  loadUser(token: string) {
    return this.http.get('http://localhost:3000/users/load/' + token);
  }

  changeImage(formData: FormData, id: string) {
    return this.http.post('http://localhost:3000/users/upload/' + id, formData);
  }

}
