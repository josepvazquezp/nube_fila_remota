import { Component } from '@angular/core';

import { Product } from 'src/app/shared/interfaces/product';

import { RestaurantService } from 'src/app/shared/services/restaurant.service';
import { SharedDataService } from 'src/app/shared/services/shared-data.service';

@Component({
  selector: 'app-restaurant-products',
  templateUrl: './restaurant-products.component.html',
  styleUrls: ['./restaurant-products.component.scss']
})
export class RestaurantProductsComponent {
  name: String = "";
  image: String = "";
  products: Array<Product> = [];

  idRestaurant: String = "";

  constructor(private sharedDataService: SharedDataService, private restaurantService: RestaurantService) {
    this.idRestaurant = this.sharedDataService.getUserRestaurant();  
    
    this.restaurantService.getRestaurant(this.idRestaurant).subscribe((response: any) => {
      this.name = response.name;
      this.image = response.image;

      this.products = response.products;
    });
  }

  sendIdProduct(id: String) {
    this.sharedDataService.setProduct(id);
  }


}
