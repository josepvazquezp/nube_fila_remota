import { Component } from '@angular/core';

import { FormGroup, FormBuilder, Validators } from '@angular/forms'

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


  constructor(formBuilder: FormBuilder) { 
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
  }

  logout() {
    this.flagLogin = false;
    this.image = "";
    this.user = "";
    this.type = false;
  }
}
