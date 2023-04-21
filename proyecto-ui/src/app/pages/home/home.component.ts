import { Component, Input } from '@angular/core';


import { SharedDataService } from 'src/app/shared/services/shared-data.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent {
  isLogged: boolean = false;
  name: String = "";
  
  constructor(private sharedDataService: SharedDataService) {
    this.isLogged = sharedDataService.getLog();
    this.name = sharedDataService.getUser() == undefined? "":sharedDataService.getUser() .name; 
  }

  setType(type: String) {
    this.sharedDataService.setTypeRestaurant(type);
  }
}
