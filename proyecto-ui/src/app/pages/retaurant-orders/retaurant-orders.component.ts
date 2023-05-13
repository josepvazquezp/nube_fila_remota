import { Component } from '@angular/core';
import { Router } from '@angular/router';

import { Product } from 'src/app/shared/interfaces/product';

import { SharedDataService } from 'src/app/shared/services/shared-data.service';
import { RestaurantService } from 'src/app/shared/services/restaurant.service';
import { ProductService } from 'src/app/shared/services/product.service'; 
import { OrderService } from 'src/app/shared/services/order.service';

import { enviroment } from 'src/enviroments/enviroment';

import { io } from 'socket.io-client';
import { MatStepper } from '@angular/material/stepper';

@Component({
  selector: 'app-retaurant-orders',
  templateUrl: './retaurant-orders.component.html',
  styleUrls: ['./retaurant-orders.component.scss']
})
export class RetaurantOrdersComponent {
  hashmap: Map<String, {
    status: String,
    quantity: number,
    products: Array<{
      product: Product,
      quantity: number
    }>}> = new Map();

  rName: String = "";

  idUserRestaurant: String = "";

  socket: any;

  keys: Array<String> = [];

  status: Array<string> = ['creada', 'aceptada', 'lista', 'finalizada'];

  constructor(
    private router:Router, 
    private sharedDataService: SharedDataService, 
    private restaurantService: RestaurantService, 
    private productService: ProductService, 
    private orderService: OrderService) {
    this.idUserRestaurant = this.sharedDataService.getUserRestaurant();
    this.getData();
  }

  ngOnInit(){
    this.socket = io(enviroment.host);
  }

  getData() {
    this.keys = [];

    setTimeout(() => {
      for(let i = 0 ; i < this.keys.length ; i++) {
        let temp = this.hashmap.get(this.keys[i])?.status;

        let index = this.status.findIndex(item => item == temp);

        if(index > 0) {
          document.getElementById(this.keys[i] + '_aceptada')?.click();

          if(index > 1) {
            document.getElementById(this.keys[i] + '_lista')?.click();

            if(index > 2) {
              document.getElementById(this.keys[i] + '_finalizada')?.click();
            }
          }
        }
      }
      
    }, 3000);

    this.restaurantService.getRestaurant(this.idUserRestaurant).subscribe((response: any) => {
      this.rName = response.name;

      for(let i = 0 ; i < response.orders.length ; i++) {

        let temp: Array<{
          product:Product, 
          quantity: number
        }> = [];

        for(let j = 0 ; j < response.orders[i].products.length ; j++) {
          this.productService.getProduct(response.orders[i].products[j].product).subscribe((product: any) => {
            
            temp.push({
              product: product,
              quantity: response.orders[i].products[j].quantity
            });

            if(j == response.orders[i].products.length - 1) {
              let o = {
                status: response.orders[i].status,
                quantity: response.orders[i].quantity,
                products: temp
              };

              this.hashmap.set(response.orders[i]._id, o);
              this.keys.push(response.orders[i]._id);
             
            }

          });
        }
      }
    });
  }

  aceptOrder(id: String) {
    let body = {status: "aceptada"};

    this.orderService.updateOrder(id, body).subscribe((response: any) => {
      this.getData();
      this.socket.emit("changeStatus", body.status);
    });
  }

  refuseOrder(id: String) {
    let body = {status: "rechazada"};

    this.orderService.updateOrder(id, body).subscribe((response: any) => {
      this.getData();
      this.socket.emit("changeStatus", body.status);
      this.router.navigate(['/restaurant_orders']);
    });
  }

  readyOrder(id: String) {
    let body = {status: "lista"};

    this.orderService.updateOrder(id, body).subscribe((response: any) => {
      this.getData();
      this.socket.emit("changeStatus", body.status);
      this.router.navigate(['/restaurant_orders']);
    });
  }

  finishOrder(id: String) {
    let body = {status: "finalizada"};

    this.orderService.updateOrder(id, body).subscribe((response: any) => {
      this.getData();
      this.socket.emit("changeStatus", body.status);
      this.router.navigate(['/restaurant_orders']);
    });
  } 
  
}
