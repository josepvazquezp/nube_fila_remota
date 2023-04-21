import { Component } from '@angular/core';

import { UserService } from 'src/app/shared/services/user.service';
import { RestaurantService } from 'src/app/shared/services/restaurant.service';
import { Router } from '@angular/router';
import { User } from 'src/app/shared/interfaces/user';
import { SharedDataService } from 'src/app/shared/services/shared-data.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-update-user',
  templateUrl: './update-user.component.html',
  styleUrls: ['./update-user.component.scss']
})
export class UpdateUserComponent {
  updateForm: FormGroup;
  selectedFile: any = null;
  type: Boolean = false;
  idRestaurant: String = "6438b2f687c92dd913c334c8";
  isLogged: boolean = false;
  user: Array<User> = [];
  
  constructor(private sharedData: SharedDataService, formBuilder: FormBuilder, private userService: UserService, private router: Router, private restaurantService: RestaurantService){
    this.isLogged = sharedData.getLog();
    this.user[0] = sharedData.getUser();
    this.type = this.user[0].type == "Cliente"? false:true;
    
    this.updateForm = formBuilder.group({
      link: [''],
      description: ['']
    });
  }

  onFileSelected(event: any): void {
      this.selectedFile = event.target.files[0] ?? null;
  }

  updateUser() {
    console.log(this.updateForm.value.description);
    console.log(this.selectedFile);

    if(this.updateForm.value.description != '' || this.selectedFile != null) {
      let body = {};

      if(this.selectedFile == null && this.updateForm.value.description != '') {
        body = {description: this.updateForm.value.description};
      }
      else if(this.selectedFile != null && this.updateForm.value.description == '') {
        body = {image: this.updateForm.value.description};
      }
      else {
        body = {description: this.updateForm.value.description, image: this.selectedFile}
      }
      
      this.restaurantService.updateRestaurant(this.idRestaurant, body).subscribe((response: any) => {
      });
    }
  }
}
