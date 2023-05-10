import { Component, ElementRef, ViewChild } from '@angular/core';
import {FormGroup, FormBuilder, Validators} from '@angular/forms';
import { Router } from '@angular/router';
import { SharedDataService } from 'src/app/shared/services/shared-data.service';
import { Chat } from 'src/app/shared/interfaces/chat';
import { ChatService } from 'src/app/shared/services/chat.service';
import { User } from 'src/app/shared/interfaces/user';
import { Message } from 'src/app/shared/interfaces/message';
import { RestaurantService } from 'src/app/shared/services/restaurant.service';
import { io } from 'socket.io-client';

import { enviroment } from 'src/enviroments/enviroment';
import { UserService } from 'src/app/shared/services/user.service';

@Component({
  selector: 'app-chatdisplay',
  templateUrl: './chatdisplay.component.html',
  styleUrls: ['./chatdisplay.component.scss']
})
export class ChatdisplayComponent {
  message: FormGroup;
  chatready = false;
  thisChat: Array<Chat> = []
  restaurantID: String = "";
  clientID: String = "";
  user: User = {
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
  guestName: String = "";
  socket: any;
  myImage: String = "";
  itImage: String = "";
  clientEmail: String = "";


  constructor(private sharedData: SharedDataService, formBuilder: FormBuilder, private router: Router,
    private chatService: ChatService, private restaurantService: RestaurantService, private userService: UserService){
    this.message = formBuilder.group({
      message: ['', Validators.required]
    });

    this.user = sharedData.getUser();
    this.myImage = this.user.image;

    this.setChat();
    
  }

  ngOnInit(){
    this.socket = io(enviroment.host);
    this.socket.on("newMessage", (data: any) => {
      console.log("Mensaje Nuevo: " + data) 
      this.setChat();
    });
  }


  setChat(){
    let body = "";

    if(this.user.type == "Cliente"){
      this.restaurantID = this.sharedData.getRestaurant();

    this.restaurantService.getRestaurant(this.restaurantID).subscribe((response: any) => {
      this.guestName = response.name;
      this.itImage = response.image;
    });
     body = JSON.parse('{"MyID": "' + this.user._id +'", "ItID": "' + this.restaurantID + '", "type": "' + this.user.type + '"}');
    }else{

      this.clientID= this.sharedData.getClientID();
      body = JSON.parse('{"MyID": "' + this.clientID +'", "ItID": "' + this.user.restaurant + '", "type": "' + this.user.type + '"}');
      this.userService.getOneUser(this.clientID).subscribe((responseU: any) => {
        this.guestName = responseU.name;
        this.itImage = responseU.image;
        this.clientEmail = responseU.email;
      });
    }
    
    this.chatService.getChat(body).subscribe((response: any) => {
        this.thisChat = response;
        this.loadChat()
        });
  }


  loadChat(){
    this.chatready = true;

  }

  clearChat(){
    this.chatready = false;
  }

  clearMessage(){
    (<HTMLInputElement>document.getElementById('messageField')).value = '';
    this.message.value.message = '';
  }

  checkMessage(){
    if(this.message.value.message != ""){
      
      

      let body = JSON.parse('{"sender": "' + this.user.name + '", "message": "' + this.message.value.message + '"}');
      this.clearMessage();

      this.chatService.putMessage(body, this.thisChat[0]._id).subscribe((response: any) => {

        this.socket.emit("sendMessage", this.message.value.message);
        this.thisChat[0] = response;
      });

    }
  }


  goBack(){
    this.router.navigate([this.sharedData.getOrigin()]);
  }

}
