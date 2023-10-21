import { Component } from '@angular/core';

import { UserService } from 'src/app/shared/services/user.service';
import { RestaurantService } from 'src/app/shared/services/restaurant.service';
import { Router } from '@angular/router';
import { User } from 'src/app/shared/interfaces/user';
import { SharedDataService } from 'src/app/shared/services/shared-data.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { enviroment } from 'src/enviroments/enviroment';

@Component({
  selector: 'app-update-user',
  templateUrl: './update-user.component.html',
  styleUrls: ['./update-user.component.scss']
})
export class UpdateUserComponent {
  updateForm: FormGroup;
  selectedFile: any = null;
  type: Boolean = false;
  idRestaurant: String = "";
  isLogged: boolean = false;

  user: User = {
    _id: "",
    email: "",
    password: "",
    name: "",
    type: "",
    history: [],
    status: "",
    image: "",
    restaurant: ""
  };

  constructor(private sharedData: SharedDataService, formBuilder: FormBuilder, private userService: UserService, private router: Router, private restaurantService: RestaurantService) {
    this.isLogged = sharedData.getLog();
    this.user = sharedData.getUser();
    this.type = this.user.type == "Cliente" ? false : true;

    this.idRestaurant = this.user.restaurant;

    this.updateForm = formBuilder.group({
      link: [''],
      description: ['']
    });
  }

  onFileSelected(event: any): void {
    this.selectedFile = event.target.files[0];
  }

  updateUser() {
    if (this.updateForm.value.description != '' || this.selectedFile != null) {
      let body = {};

      if (this.selectedFile == null && this.updateForm.value.description != '') {
        body = { description: this.updateForm.value.description };

        this.restaurantService.updateRestaurant(this.idRestaurant, body).subscribe((response: any) => {
        });
      }
      else if (this.selectedFile != null && this.updateForm.value.description == '') {
        if (this.selectedFile) {
          let id: any = this.sharedData.getUser()._id;

          const formData = new FormData();
          formData.append("file", this.selectedFile);
          this.userService.changeImage(formData, id).subscribe((response: any) => {
            let body = JSON.parse(JSON.stringify({ image: enviroment.bucket + response.image }));

            this.userService.putUser(body, id).subscribe(response => {
              if (this.idRestaurant) {
                this.restaurantService.updateRestaurant(this.idRestaurant, body).subscribe((response: any) => {
                  window.location.href = '/';
                });
              }
              else {
                window.location.href = '/';
              }
            });
          });
        }
      }
      else {
        if (this.selectedFile) {
          let id: any = this.sharedData.getUser()._id;

          const formData = new FormData();
          formData.append("file", this.selectedFile);
          this.userService.changeImage(formData, id).subscribe((response: any) => {
            let img = response.image;
            let body = JSON.parse(JSON.stringify({ image: enviroment.host + "/image/" + img }));

            this.userService.putUser(body, id).subscribe(response => {
              body = { description: this.updateForm.value.description, image: enviroment.host + "/image/" + img };

              this.restaurantService.updateRestaurant(this.idRestaurant, body).subscribe((response: any) => {
                window.location.href = '/';
              });
            });
          });
        }
      }

    }
  }
}
