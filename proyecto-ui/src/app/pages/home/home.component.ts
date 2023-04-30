import { Component } from '@angular/core';
import { Router } from '@angular/router';

import { Restaurant } from 'src/app/shared/interfaces/restaurant';
import { Product } from 'src/app/shared/interfaces/product';

import { SharedDataService } from 'src/app/shared/services/shared-data.service';
import { RestaurantService } from 'src/app/shared/services/restaurant.service';
import { ProductService } from 'src/app/shared/services/product.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent {
  isLogged: boolean = false;
  name: String = "";
  filterR: boolean = true;
  filterP: boolean = true;
  value: String = "";

  searchR: Array<Restaurant> = [];
  searchP: Array<Product> = [];
  displayR: Array<{
    id: String,
    image: String,
    name: String
  }> = [];
  
  constructor(private sharedDataService: SharedDataService, private restaurantService: RestaurantService, private productService: ProductService, private router: Router) {
    this.isLogged = sharedDataService.getLog();
    this.name = sharedDataService.getUser() == undefined? "":sharedDataService.getUser() .name; 
  }

  setType(type: String) {
    this.sharedDataService.setTypeRestaurant(type);
  }

  searchRestaurants(filter: String) {
    this.restaurantService.searchRestaurants(filter).subscribe((response: any) => {
      this.searchR = response;
    });
  }
  
  searchProducts(filter: String) {
    this.productService.searchProducts(filter).subscribe((response: any) => {
      this.searchP = response;
      console.log(this.searchP.length);
      for(let i = 0 ; i < this.searchP.length ; i++) {
        this.restaurantService.getRestaurant(response[i].RestaurantId).subscribe((restaurant: any) => {
          this.displayR.push({
            id: restaurant._id,
            image: restaurant.image,
            name: restaurant.name});
        });
      }

    });
  }

  change(p: boolean, r: boolean) {
    this.filterP = p;
    this.filterR = r;
  }

  search() {
    if(this.filterP && this.filterR) {
      this.searchProducts(this.value);
      this.searchRestaurants(this.value);
    }
    else if(this.filterP) {
      this.searchProducts(this.value);
    }
    else if(this.filterR) {
      this.searchRestaurants(this.value);
    }
  }

  setRestaurant(id: String) {
    this.sharedDataService.setRestaurant(id);
    this.router.navigate(['/display_restaurant'])
  }
}
