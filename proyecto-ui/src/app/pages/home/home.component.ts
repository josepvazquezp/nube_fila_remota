import { Component } from '@angular/core';

import { SharedDataService } from 'src/app/shared/services/shared-data.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent {
  constructor(private sharedDataService: SharedDataService) {
    
    // esto se setea en un futuro al darle clic al botón del restaurant
    this.sharedDataService.setRestaurant("6438b2f687c92dd913c334c8");
  }
}
