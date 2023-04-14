import { Component } from '@angular/core';
import { UserService } from 'src/app/shared/services/user.service';
import { User } from 'src/app/shared/interfaces/user';

import {FormGroup, FormBuilder, Validators} from '@angular/forms';

@Component({
  selector: 'app-create-user',
  templateUrl: './create-user.component.html',
  styleUrls: ['./create-user.component.scss']
})
export class CreateUserComponent {


  userList: Array<User> = [];


  userForm: FormGroup;

  constructor(private usersService: UserService, formBuilder: FormBuilder) {
    this.userForm = formBuilder.group({
      name: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      pass1: ['', Validators.required],
      pass2: ['', Validators.required],
    });
  }

  checkForm(){

  
    //checkUsers();
  }

  checkUsers() {

    this.usersService.getUsers().subscribe((response: any) => {
      this.userList = response;
      console.log(this.userList);
      









      

    });
  }



}
