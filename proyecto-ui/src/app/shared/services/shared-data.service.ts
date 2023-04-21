import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class SharedDataService {
  private restaurantID: String = "";
  private orderID: String = "";
  private productID: String = "";
  private customerID: String = "";
  private userRestaurantID: String = "";

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

}
