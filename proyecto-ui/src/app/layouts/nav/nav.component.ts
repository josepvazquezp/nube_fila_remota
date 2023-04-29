import { Component } from '@angular/core';

import { FormGroup, FormBuilder, Validators } from '@angular/forms'
import { UserService } from 'src/app/shared/services/user.service';
import { User } from 'src/app/shared/interfaces/user';
import { Router } from '@angular/router';
import { SharedDataService } from 'src/app/shared/services/shared-data.service';
import { share } from 'rxjs';
import { AuthService } from 'src/app/shared/services/auth.service';



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


  constructor(private router: Router, private sharedData: SharedDataService, private authService: AuthService) { 
    this.authService.authStatus.subscribe((status: boolean) => {
      this.flagLogin = status;
      this.login(this.flagLogin);
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
