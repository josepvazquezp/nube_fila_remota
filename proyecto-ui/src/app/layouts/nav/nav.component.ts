import { Component } from '@angular/core';

import { FormGroup, FormBuilder, Validators } from '@angular/forms';

import { SharedDataService } from 'src/app/shared/services/shared-data.service';

@Component({
  selector: 'app-nav',
  templateUrl: './nav.component.html',
  styleUrls: ['./nav.component.scss']
})
export class NavComponent {
  flagModalLogin: Boolean = false;
  formLogin: FormGroup;
  flagLogin: Boolean = false; //Si esta ya iniciada la sesión o no
  image: String = "";
  user: String = "";
  type: Boolean = false;


  constructor(private sharedDataService: SharedDataService, formBuilder: FormBuilder) { 
    this.formLogin = formBuilder.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required]]
    });
  }

  displayLogin() {
    this.flagModalLogin = true;
  }

  quitLogin() {
    this.flagModalLogin = false;
  }
  
  readLogin() {
    this.flagModalLogin = false;
    console.log(this.formLogin.value);
    // en el caso que los datos esten en la base de datos
    this.flagLogin = true;
    this.image = "../../../assets/images/logo.png";
    this.user = this.formLogin.value.email;
    this.type = true;

    //ya con verificación token y todo y ser tipo restaurant
    this.sharedDataService.setUserRestaurant("6438b2f687c92dd913c334c8");

    //ya con verificación token y todo y ser tipo usuario
    this.sharedDataService.setCustomer("64399dacddc3bcf1989b709b");
  }

  logout() {
    this.flagLogin = false;
    this.image = "";
    this.user = "";
    this.type = false;
  }
}
