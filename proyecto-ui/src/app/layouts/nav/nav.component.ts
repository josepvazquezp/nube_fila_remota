import { Component } from '@angular/core';

import { FormGroup, FormBuilder, Validators } from '@angular/forms'
import { UserService } from 'src/app/shared/services/user.service';
import { User } from 'src/app/shared/interfaces/user';
import { Router } from '@angular/router';
import { SharedDataService } from 'src/app/shared/services/shared-data.service';
import { share } from 'rxjs';



@Component({
  selector: 'app-nav',
  templateUrl: './nav.component.html',
  styleUrls: ['./nav.component.scss']
})
export class NavComponent {
  user: String = "";
  flagModalLogin: Boolean = false;
  formLogin: FormGroup;
  flagLogin: boolean = false; //Si esta ya iniciada la sesión o no
  image: String = "";

  //Componentes del Usuario
  id: String = "";
  name: String = "";
  email: String = "";
  type: Boolean = false; //false es Cliente, true es Restaurante

  userLogged: Array<User> = [];


  constructor(private usersService: UserService, formBuilder: FormBuilder,   private router: Router, private sharedData: SharedDataService) { 
    this.formLogin = formBuilder.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required]]
    });


    if(!sharedData.getLog()){
      this.flagModalLogin = false;
      this.flagLogin = false;
    }
  }

  displayLogin() {
    this.flagModalLogin = true;
  }

  quitLogin() {
    this.flagModalLogin = false;
  }
  
  readLogin() {
   
    //Verificar formulario
    console.log(this.formLogin.value);
    // en el caso que los datos esten en la base de datos
    this.flagLogin = true;
    this.image = "../../../assets/images/logo.png";
    this.user = this.formLogin.value.email;
    this.type = true;

    //ya con verificación token y todo y ser tipo restaurant
    this.sharedData.setUserRestaurant("6438b2f687c92dd913c334c8");

    //ya con verificación token y todo y ser tipo usuario
    this.sharedData.setCustomer("64399dacddc3bcf1989b709b");
    this.checkLoginData()
      
  }

  logout() {
    this.flagLogin = false;
    this.image = "";
    this.email = "";
    this.type = false;
  }


  checkLoginData(){
    let body =  JSON.parse('{"email":"' + this.formLogin.value.email +'",'+
    '"password":"' + this.formLogin.value.password +'"}');

    this.usersService.getUserLogin(body).subscribe((response: any) => {
      console.log(response)
      if(response.length != 0){ //Se encontró el usuario 
        console.log("Usuario encontrado")
        this.userLogged = response;
        this.login(true);
      }else{//No se encontró nada
        this.login(false);
      }
    });

  }

  login(isLogged: boolean){
    if(isLogged){
      
      this.id = this.userLogged[0]._id;
      this.name = this.userLogged[0].name
      this.email = this.userLogged[0].email
      this.type = (this.userLogged[0].type == "Cliente") ? false : true;
      this.image = this.userLogged[0].image;


      this.flagModalLogin = false;
      this.flagLogin = true;


      

      this.sharedData.setLog(this.flagLogin);
      this.sharedData.setName(this.name);
      this.sharedData.setUser(this.userLogged[0]);
      

    }else{
      alert("El correo y/o la contraseña están equivocados");
    }
  }
}
