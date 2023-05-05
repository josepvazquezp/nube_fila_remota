import { Component } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';

import { share } from 'rxjs';
import { SocialAuthService, SocialUser } from '@abacritt/angularx-social-login';

import { User } from 'src/app/shared/interfaces/user';
import { UserService } from 'src/app/shared/services/user.service';
import { SharedDataService } from 'src/app/shared/services/shared-data.service';
import { AuthService } from 'src/app/shared/services/auth.service';
import { LoginService } from 'src/app/shared/services/login.service';



@Component({
  selector: 'app-nav',
  templateUrl: './nav.component.html',
  styleUrls: ['./nav.component.scss']
})
export class NavComponent {
  user: String = "";
  flagLogin: boolean = false; //Si esta ya iniciada la sesión o no
  image: String = "";

  //Componentes del Usuario
  name: String = "";
  email: String = "";
  type: Boolean = false; //false es Cliente, true es Restaurante


  constructor(
    private router: Router, 
    private sharedData: SharedDataService, 
    private authService: AuthService, 
    private userService: UserService,
    private socialAuthService: SocialAuthService,
    private loginService: LoginService) { 
    this.authService.authStatus.subscribe((status: boolean) => {
      this.flagLogin = status;

      if(this.sharedData.getUser()._id != "")
        this.login(this.flagLogin);
      else if(this.authService.isAuth()) {
        let temp = this.authService.getToken();
        this.userService.loadUser(temp).subscribe((response: any) => {
            this.sharedData.setUser(response);
            this.login(this.flagLogin);
        });
      }
    });

    this.socialAuthService.authState.subscribe((user: SocialUser) => {
      if(user) {
        this.loginService.googleLogin(user.idToken).subscribe(response => {
          this.authService.setToken(response.token);

          if(response.user != undefined) {
            
            this.sharedData.setUser(response.user);
            this.login(this.flagLogin);
          }

          this.router.navigate(['/']);
        })
      }
    });
  }

  logout() {
    this.flagLogin = false;
    this.image = "";
    this.email = "";
    this.type = false;

    this.authService.deleteToken();
    this.router.navigate(['/']);
  }

  login(isLogged: boolean){
    if(isLogged) {
      let tempUser: User = this.sharedData.getUser();
      console.log(tempUser);
      
      this.name = tempUser.name
      this.email = tempUser.email
      this.type = (tempUser.type == "Cliente") ? false : true;
      this.image = tempUser.image;

      this.flagLogin = true;


      // se da de alta el usuario para que todos los proceso sean en base a ese ID
      this.sharedData.setCustomer(tempUser._id);    //"64399dacddc3bcf1989b709b");

      if(tempUser.type == "Cliente") {
        this.type = false;      
      }
      else {
        this.type = true;
        // se da de alta el restaurante para que todos los proceso sean en base a ese ID
        this.sharedData.setUserRestaurant(tempUser.restaurant);    //"6438b2f687c92dd913c334c8");
      }

    }
  }
}
