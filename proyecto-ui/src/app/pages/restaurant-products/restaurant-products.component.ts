import { Component } from '@angular/core';

import { RestaurantService } from 'src/app/shared/services/restaurant.service';
import { Product } from 'src/app/shared/interfaces/product';

@Component({
  selector: 'app-restaurant-products',
  templateUrl: './restaurant-products.component.html',
  styleUrls: ['./restaurant-products.component.scss']
})
export class RestaurantProductsComponent {
  name: String = "";
  image: String = "";
  products: Array<Product> = [];

  idRestaurant: String = "6438b2f687c92dd913c334c8";

  constructor(private restaurantService: RestaurantService) {
      this.restaurantService.getRestaurant(this.idRestaurant).subscribe((response: any) => {
      this.name = response.name;
      this.image = response.image;

      this.products = response.products;
    });
  }
}
