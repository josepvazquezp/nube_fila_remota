import { Component } from '@angular/core';
import { UserService } from 'src/app/shared/services/user.service';
import { User } from 'src/app/shared/interfaces/user';
import { Router } from '@angular/router';

import {FormGroup, FormBuilder, Validators} from '@angular/forms';

@Component({
  selector: 'app-create-user',
  templateUrl: './create-user.component.html',
  styleUrls: ['./create-user.component.scss']
})
export class CreateUserComponent {


  userList: Array<User> = [];
  userForm: FormGroup;

  type: string = "Cliente";

  constructor(private usersService: UserService, formBuilder: FormBuilder, private router: Router) {
    this.userForm = formBuilder.group({
      name: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      pass1: ['', Validators.required],
      pass2: ['', Validators.required]
    });
  }


  typeCliente(){
    this.type = "Cliente";
  }

  typeRestaurant(){
    this.type = "Restaurante";
  }


  checkForm(){
    if(!this.userForm.valid){
      alert("Por favor, llene todos los campos");
    }else{
      if(this.userForm.value.pass1 != this.userForm.value.pass2){
        alert("Las contraseñas ingresadas no coinciden");
      }else{
        this.checkUsers();
      }
    }
    
  }

  checkUsers() {

    this.usersService.getUserCreate(this.userForm.value.email).subscribe((response: any) => {
      this.userList = response;
    
      if(this.userList.length == 0){
        this.createUser();  
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
        if(response != undefined){
          console.log("Usuario creado: \n" + response);
          alert("Usuario Creado con Éxito!");
          this.router.navigate(['/']);
        }
        

       });
  }



}
