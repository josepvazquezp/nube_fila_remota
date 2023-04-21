import { Injectable } from '@angular/core';
import { User } from '../interfaces/user';

@Injectable({
  providedIn: 'root'
})
export class SharedDataService {
  private restaurantID: String = "";
  private orderID: String = "";
  private productID: String = "";
  private customerID: String = "";
  private userRestaurantID: String = "";
  private log: boolean = false;
  private name: String = "";

  private CardID: String = "";

  user: Array<User> = [];

  constructor() { }

  setRestaurant(restaurantID: String) {
    this.restaurantID = restaurantID;
  }

  getRestaurant() {
    return this.restaurantID;
  }

  setOrder(orderID: String) {
    this.orderID = orderID;
  }

  getOrder() {
    return this.orderID;
  }

  setProduct(productID: String) {
    this.productID = productID;
  }

  getProduct() {
    return this.productID;
  }

  setCustomer(customerID: String) {
    this.customerID = customerID;
  }

  getCustomer() {
    return this.customerID;
  }

  setUserRestaurant(userRestaurantID: String) {
    this.userRestaurantID = userRestaurantID;
  }

  getUserRestaurant() {
    return this.userRestaurantID;
  }

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
