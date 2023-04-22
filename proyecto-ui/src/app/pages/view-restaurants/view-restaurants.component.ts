import { Component } from '@angular/core';

import { SharedDataService } from 'src/app/shared/services/shared-data.service';
import { RestaurantService } from 'src/app/shared/services/restaurant.service';
import { Restaurant } from 'src/app/shared/interfaces/restaurant';

@Component({
  selector: 'app-view-restaurants',
  templateUrl: './view-restaurants.component.html',
  styleUrls: ['./view-restaurants.component.scss']
})
export class ViewRestaurantsComponent {
  type: String = "";
  image: String = ""; 
  restaurants: Array<Restaurant> = [];

  constructor(private sharedDataService: SharedDataService, private restaurantService: RestaurantService) {
    this.type = this.sharedDataService.getTypeRestaurant();
    this.image = this.type.toLowerCase() + ".jpg";

    this.restaurantService.filterRestaurants(this.type).subscribe((response: any) => {
      this.restaurants = response;
    });
  }

  setRestaurant(id: String) {
    this.sharedDataService.setRestaurant(id);
  }
}
