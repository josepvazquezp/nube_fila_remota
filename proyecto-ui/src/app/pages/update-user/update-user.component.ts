import { Component } from '@angular/core';
import {FormGroup, FormBuilder, Validators} from '@angular/forms';
import { Router } from '@angular/router';
import { User } from 'src/app/shared/interfaces/user';
import { SharedDataService } from 'src/app/shared/services/shared-data.service';
import { UserService } from 'src/app/shared/services/user.service';

@Component({
  selector: 'app-update-user',
  templateUrl: './update-user.component.html',
  styleUrls: ['./update-user.component.scss']
})
export class UpdateUserComponent {

  isLogged: boolean = false;
  user: Array<User> = [];
  formUpdate: FormGroup;

  constructor(private sharedData: SharedDataService, formBuilder: FormBuilder, private userService: UserService, private router: Router){
    this.isLogged = sharedData.getLog();
    this.user[0] = sharedData.getUser();
    
    this.formUpdate = formBuilder.group({
      link: ['', Validators.required]
    });


  }

  checkUpdate(){
    if(!this.formUpdate.valid){
      alert("Por favor, coloque el link.");
    }else{
      this.updateUser();

    }
  }


  updateUser(){

    let body = JSON.parse('{"image": "'+ this.formUpdate.value.link  +'"}');

    console.log(body);

    this.userService.putUser( body, this.user[0]._id).subscribe((response: any) => {
      alert("Usuario Modificado")
     this.router.navigate(['/']);
    });
  }  



}
