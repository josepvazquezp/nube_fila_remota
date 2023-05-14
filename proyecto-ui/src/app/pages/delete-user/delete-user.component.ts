import { Component } from '@angular/core';
import {FormGroup, FormBuilder, Validators} from '@angular/forms';
import { User } from 'src/app/shared/interfaces/user';
import { AuthService } from 'src/app/shared/services/auth.service';
import { RestaurantService } from 'src/app/shared/services/restaurant.service';
import { SharedDataService } from 'src/app/shared/services/shared-data.service';
import { UserService } from 'src/app/shared/services/user.service';

@Component({
  selector: 'app-delete-user',
  templateUrl: './delete-user.component.html',
  styleUrls: ['./delete-user.component.scss']
})
export class DeleteUserComponent {
  isLogged: boolean = false;
  name: String = "";
  user: User = {
    _id: "",
    email: "",
    password: "",
    name: "",
    type: "",
    history: [],
    status: "",
    image:  "",
    restaurant: ""
  };
  formDelete: FormGroup;

  constructor(
    private sharedData: SharedDataService,
    private formBuilder: FormBuilder,
    private userService: UserService,
    private authService: AuthService,
    private restaurantService: RestaurantService) {
    this.isLogged = sharedData.getLog();
    this.name = sharedData.getName();
    this.user = sharedData.getUser();
    
    this.formDelete = formBuilder.group({
      pass: ['', Validators.required],
      check: [false, Validators.requiredTrue]
    });


  }

  checkDelete(){
    if(!this.formDelete.valid){
      alert("Por favor, coloque su contraseña y acepte los términos.");
    }else{
      if(this.formDelete.value.pass == this.user.password){
        //El usuario se puede eliminar
        this.deleteUser();
      }else{
        alert("La contraseña ingresada es Incorrecta.")
      }

    }
  }


  deleteUser(){

    this.sharedData.setName("");
    this.sharedData.setLog(false);


    this.userService.deleteUser(this.user._id).subscribe((response: any) => {
      if(response.restaurant) {
        this.restaurantService.deleteRestaurant(this.user.restaurant).subscribe((response: any) => {
          this.authService.deleteToken();
          window.location.href = '/';
        });
      }
      else {
        this.authService.deleteToken();
        window.location.href = '/';
      }
    });
  }  


}
