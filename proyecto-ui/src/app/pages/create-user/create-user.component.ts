import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';

import { UserService } from 'src/app/shared/services/user.service';
import { RestaurantService } from 'src/app/shared/services/restaurant.service';

import { User } from 'src/app/shared/interfaces/user';
import { LoginService } from 'src/app/shared/services/login.service';
import { AuthService } from 'src/app/shared/services/auth.service';
import { SharedDataService } from 'src/app/shared/services/shared-data.service';

@Component({
  selector: 'app-create-user',
  templateUrl: './create-user.component.html',
  styleUrls: ['./create-user.component.scss']
})
export class CreateUserComponent {


  userList: Array<User> = [];
  userForm: FormGroup;
  restaurantForm: FormGroup;

  type: string = "Cliente";

  constructor(
    private usersService: UserService, 
    private restaurantService: RestaurantService,
    private formBuilder: FormBuilder,
    private router: Router,
    private loginService: LoginService,
    private authService: AuthService,
    private sharedData: SharedDataService) {
    this.userForm = formBuilder.group({
      name: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      pass1: ['', Validators.required],
      pass2: ['', Validators.required]
    });

    this.restaurantForm = formBuilder.group({
      name: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      pass1: ['', Validators.required],
      pass2: ['', Validators.required],
      restaurantName: ['', Validators.required],
      description: ['', Validators.required], 
      category: ['', Validators.required],
      location: ['', Validators.required]
    });
  }


  typeCliente(){
    this.type = "Cliente";
  }

  typeRestaurant(){
    this.type = "Restaurante";
  }


  checkForm(form: FormGroup){
    if(!form.valid){
      alert("Por favor, llene todos los campos");
    }
    else{
      if(form.value.pass1 != form.value.pass2){
        alert("Las contraseñas ingresadas no coinciden");
      }
      else{
        this.checkUsers(form.value.email);
      }
    }
    
  }

  checkUsers(email: string) {

    this.usersService.getUserCreate(email).subscribe((response: any) => {
      this.userList = response;
    
      if(this.userList.length == 0) {
        if(this.restaurantForm.value.category == "") {
          this.createUser();
        }
        else {
          this.createRestaurant();
        }
      }else{
        alert("Ya existe un usuario con el correo ingresado!!");
      }    
    });
  }


  createUser(){
    let body = JSON.parse('{"name":"' + this.userForm.value.name +'",'
       + '"email":"' + this.userForm.value.email +'",'+
       ' "password":"' + this.userForm.value.pass1 +'","type":"' + this.type +'"  }');

       this.usersService.postUsers(body).subscribe((response: any) => {
        let body =  JSON.parse('{"email":"' + response.email +'",'+
                                   '"password":"' + response.password +'"}');
            this.loginService.login(body).subscribe((response: any) => {
      
              //Se encontró el usuario 
                 this.sharedData.setLog(true);
                 this.sharedData.setName(response.user.name);
                 this.sharedData.setUser(response.user);
         
                 this.authService.setToken(response.token);
         
                 this.router.navigate(['/']);
             });
       });
  }

  createRestaurant() {
    let body = JSON.parse(JSON.stringify({
      name: this.restaurantForm.value.name,
      email: this.restaurantForm.value.email,
      password: this.restaurantForm.value.pass1,
      type: "Restaurante"
    }));

    let bRes = JSON.parse(JSON.stringify({
      name: this.restaurantForm.value.restaurantName,
      description: this.restaurantForm.value.description,
      type: this.restaurantForm.value.category,
      location: this.restaurantForm.value.location
    }));
    
    this.usersService.postUsers(body).subscribe((response: any) => {
        this.restaurantService.createRestaurant(bRes).subscribe((restaurant: any) => {
          let temp = JSON.parse(JSON.stringify({
            restaurant: restaurant._id
          }));


          this.usersService.putUser(temp, response._id).subscribe((response: any) => {
            let body =  JSON.parse('{"email":"' + response.email +'",'+
                                   '"password":"' + response.password +'"}');
            this.loginService.login(body).subscribe((response: any) => {
      
              //Se encontró el usuario 
                 this.sharedData.setLog(true);
                 this.sharedData.setName(response.user.name);
                 this.sharedData.setUser(response.user);
         
                 this.authService.setToken(response.token);
         
                 this.router.navigate(['/']);
             });

          });

        });
    });
  }

}
