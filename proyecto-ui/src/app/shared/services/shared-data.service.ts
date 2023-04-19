import { Injectable } from '@angular/core';
import { User } from '../interfaces/user';

@Injectable({
  providedIn: 'root'
})
export class SharedDataService {
  private log: boolean = false;
  private name: String = "";

  private CardID: String = "";

  user: Array<User> = [];


  setLog(log: boolean){
    this.log = log;
  }

  getLog(){
    return this.log;
  }

  setName(name: String){
    this.name = name;
  }

  getName(){
    return this.name;
  }

  setCard(CardID: String){
    this.CardID = CardID;
  }

  getCard(){
    return this.CardID;
  }

  setUser(user: User){
    this.user[0] = user;
  }

  getUser(){
    return this.user[0];
  }


}
