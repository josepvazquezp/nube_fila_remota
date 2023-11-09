import { Component } from '@angular/core';
import { Router } from '@angular/router';

import { Restaurant } from 'src/app/shared/interfaces/restaurant';
import { Product } from 'src/app/shared/interfaces/product';
import { ProductOrder } from 'src/app/shared/interfaces/product-order';

import { RestaurantService } from 'src/app/shared/services/restaurant.service';
import { OrderService } from 'src/app/shared/services/order.service';
import { SharedDataService } from 'src/app/shared/services/shared-data.service';


@Component({
  selector: 'app-display-order',
  templateUrl: './display-order.component.html',
  styleUrls: ['./display-order.component.scss']
})
export class DisplayOrderComponent {
  products: Array<{
    product: Product,
    restaurant: Restaurant,
    quantity: number,
    subtotal: number
  }> = [];

  hashmap: Map<String, ProductOrder> = new Map<String, ProductOrder>();

  keys: Array<String> = [];

  restaurant: Restaurant = {
    _id: '',
    name: '',
    email: '',
    products: [],
    description: '',
    type: '',
    location: '',
    image: '',
    orders: []
  };

  backup: Array<{
    product: Object,
    quantity: number,
    _id: Object
  }> = [];

  total: number = 0;
  quantity: number = 0;

  idCustomer: String = "";
  idOrder: String = "";

  constructor(private router: Router, private sharedDataService: SharedDataService, private orderService: OrderService, private restaurantService: RestaurantService) {
    this.idOrder = this.sharedDataService.getOrder();
    this.idCustomer = this.sharedDataService.getCustomer();

    this.getData();
  }

  getData() {
    this.keys = [];

    this.orderService.getOrder(this.idOrder).subscribe((response: any) => {
      this.backup = response.products;
      this.quantity = response.quantity;
      this.products = response.products;
      this.total = response.total;

      this.restaurantService.getRestaurant(response.products[0].product.RestaurantId).subscribe((restaurant: any) => {
        this.restaurant = restaurant;

        for (let i = 0; i < response.products.length; i++) {

          this.keys.push(response.products[i].product._id);

          this.hashmap.set(response.products[i].product._id, {
            productName: response.products[i].product.Name,
            productImage: response.products[i].product.Image,
            productPrice: response.products[i].product.Price,
            quantity: response.products[i].quantity,
            subtotal: response.products[i].product.Price * response.products[i].quantity
          });
        }

      });
    });
  }

  addProduct(id: String) {
    let index = this.keys.findIndex(item => item == id);
    this.backup[index].quantity = +this.products[index].quantity + 1;
    let temp: number = +this.products[index].product.Price + +this.total

    let body = {
      products: this.backup,
      quantity: ++this.quantity,
      total: temp
    };

    this.orderService.updateOrder(this.idOrder, body).subscribe((response: any) => {
      this.getData();

      this.router.navigate(['/display_order']);
    });
  }

  decreaseProduct(id: String) {
    let index = this.products.findIndex(item => item.product._id == id);
    let temp = +this.products[index].quantity - 1;
    if (temp == 0) {
      this.removeProduct(id);
    }
    else {
      this.backup[index].quantity = +this.products[index].quantity - 1;

      let body = {
        products: this.backup,
        quantity: --this.quantity,
        total: this.total - this.products[index].product.Price
      };

      this.orderService.updateOrder(this.idOrder, body).subscribe((response: any) => {

        this.getData();

        this.router.navigate(['/display_order']);
      });
    }
  }

  removeProduct(id: String) {
    let index = this.products.findIndex(item => item.product._id == id);
    let qp = this.products[index].quantity;
    let price = this.products[index].product.Price;
    this.backup.splice(index, 1);

    let body = {
      products: this.backup,
      quantity: this.quantity - qp,
      total: this.total - price * qp
    };

    this.orderService.updateOrder(this.idOrder, body).subscribe((response: any) => {

      this.getData();

      this.router.navigate(['/display_order']);
    });
  }

  // uploadOrder() {
  //   this.restaurant.orders.push(this.idOrder);

  //   let body = {orders: this.restaurant.orders}

  //   this.restaurantService.updateRestaurant(this.restaurant._id, body).subscribe((response: any) => {
  //     this.router.navigate(['/order_in_progress']);
  //   });
  // }

  deleteOrder() {
    this.orderService.deleteOrder(this.idOrder).subscribe((response: any) => {
    });
  }
}
