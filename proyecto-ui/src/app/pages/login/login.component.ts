import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';

import { User } from 'src/app/shared/interfaces/user';

import { SharedDataService } from 'src/app/shared/services/shared-data.service';
import { LoginService } from 'src/app/shared/services/login.service';
import { AuthService } from 'src/app/shared/services/auth.service';
import { catchError, throwError } from 'rxjs';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent {

  formLogin: FormGroup;

  userLogged: User = {
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

  constructor(private loginService: LoginService, formBuilder: FormBuilder,   private router: Router, private sharedData: SharedDataService, private authService: AuthService) { 
    this.formLogin = formBuilder.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required]]
    });
  }

  readLogin() {
    let body =  JSON.parse('{"email":"' + this.formLogin.value.email +'",'+
    '"password":"' + this.formLogin.value.password +'"}');

    this.loginService.login(body).subscribe((response: any) => {
      // console.log(response)
      
     //Se encontró el usuario 
        this.userLogged = response.user;
        this.sharedData.setLog(true);
        this.sharedData.setName(this.userLogged.name);
        this.sharedData.setUser(this.userLogged);

        this.authService.setToken(response.token);

      // this.router.navigate(['/']);
    },
    (error) => {
      alert("El correo y/o la contraseña están equivocados");
    });
  }

}
