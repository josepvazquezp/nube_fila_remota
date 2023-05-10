import { Component } from '@angular/core';
import { User } from 'src/app/shared/interfaces/user';
import { Chat } from 'src/app/shared/interfaces/chat';
import { ChatService } from 'src/app/shared/services/chat.service';
import { SharedDataService } from 'src/app/shared/services/shared-data.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-chat-select',
  templateUrl: './chat-select.component.html',
  styleUrls: ['./chat-select.component.scss']
})
export class ChatSelectComponent {
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
  chatsDisplay: Array<Chat> = [];
  areChats: boolean = false;


  constructor(private sharedData: SharedDataService, private chatService: ChatService, private router: Router){
    this.user = this.sharedData.getUser();
    let definitiveID = (this.user.type == "Cliente") ? this.user._id : this.user.restaurant;


    let body = JSON.parse('{"MyID": "' +definitiveID +'", "type": "' + this.user.type + '"}'); 
    console.log(this.sharedData.getRestaurant());

    this.chatService.getMyChats(body).subscribe((response: any) => {
        this.chatsDisplay = response;
        if(response.length > 0){
          this.areChats = true;
        }

        


    });

  }

  selectChat(id: String){

    if(this.user.type == "Cliente"){
      this.sharedData.setRestaurant(id);
    }else{
      this.sharedData.setClientID(id);
    }

    this.sharedData.setOrigin("chatSelect")
    this.router.navigate(['/chat']);
  }



}
