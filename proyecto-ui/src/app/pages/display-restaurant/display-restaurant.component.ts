import { Component } from '@angular/core';

import { RestaurantService } from 'src/app/shared/services/restaurant.service';
import { Product } from 'src/app/shared/interfaces/product';
import { OrderService } from 'src/app/shared/services/order.service';

@Component({
  selector: 'app-display-restaurant',
  templateUrl: './display-restaurant.component.html',
  styleUrls: ['./display-restaurant.component.scss']
})
export class DisplayRestaurantComponent {
  name: String = "";
  description: String = "";
  type: String = "";
  location: String = "";
  image: String = "";
  products: Array<Product> = [];

  idRestaurant: String = "6438b2f687c92dd913c334c8";
  idCustomer: String = "64399dacddc3bcf1989b709b";
  idOrder: String = "643c5fafbc06c4deb2916f9a";

  constructor(private restaurantService: RestaurantService, private orderService: OrderService) {
      this.restaurantService.getRestaurant(this.idRestaurant).subscribe((response: any) => {
      this.name = response.name;
      this.description = response.description;
      this.type = response.type;
      this.location = response.location;
      this.image = response.image;

      this.products = response.products;
    });
  }

  addOrder(id: String) {    //id esta hardcodeado en el html
    console.log(id);

    let index = this.products.findIndex(item => item._id == id);
    let product = this.products[index];

    console.log(product);

    if(this.idOrder == '') {
      let body = {
        customerId: this.idCustomer, 
        restaurantId: this.idRestaurant, 
        total: product.Price,
        product: product._id,
        quantity: 1
      };

      console.log(body);

      this.orderService.createOrder(body).subscribe((response: any) => {
      });
    }
    else {
      this.orderService.getOrder(this.idOrder).subscribe((response: any) => {
        if(response) {
          let products = response.products;
          let index;
          
          for(let i = 0 ; i < products.length ; i++) {
            if(products[i].product._id == id) {
              index = i;
              break;
            }
          }

          if(index == undefined) {
            products.push({product: id, quantity: 1});
          }
          else {
            products[index].quantity++;
          }

          let body = {products: products, quantity: ++response.quantity, total: response.total + product.Price};

          this.orderService.updateOrder(this.idOrder, body).subscribe((response: any) => {
          });
        }
      });
    }
    
  }
}
