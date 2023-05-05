import { Component, ElementRef, ViewChild } from '@angular/core';
import {FormGroup, FormBuilder, Validators} from '@angular/forms';
import { Router } from '@angular/router';
import { SharedDataService } from 'src/app/shared/services/shared-data.service';
import { Chat } from 'src/app/shared/interfaces/chat';
import { ChatService } from 'src/app/shared/services/chat.service';
import { User } from 'src/app/shared/interfaces/user';
import { Message } from 'src/app/shared/interfaces/message';
import { RestaurantService } from 'src/app/shared/services/restaurant.service';

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


  constructor(private sharedData: SharedDataService, formBuilder: FormBuilder, private router: Router, private chatService: ChatService, private restaurantService: RestaurantService){
    this.message = formBuilder.group({
      message: ['', Validators.required]
    });
    this.user = sharedData.getUser();
    this.restaurantID = sharedData.getRestaurant();

    this.restaurantService.getRestaurant(this.restaurantID).subscribe((response: any) => {
      this.guestName = response.name;
 
    });


    let body = JSON.parse('{"MyID": "' + this.user._id +'", "ItID": "' + this.restaurantID + '"}');
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
      console.log(body)
      this.chatService.putMessage(body, this.thisChat[0]._id).subscribe((response: any) => {

        this.thisChat[0] = response;
          });

    }
  }

}
