import { Component } from '@angular/core';
import { User } from 'src/app/shared/interfaces/user';
import { ChatService } from 'src/app/shared/services/chat.service';
import { SharedDataService } from 'src/app/shared/services/shared-data.service';
import { Router } from '@angular/router';
import { ChatSelection } from 'src/app/shared/interfaces/chat-selection';
import { RestaurantService } from 'src/app/shared/services/restaurant.service';
import { UserService } from 'src/app/shared/services/user.service';

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
  chatsDisplay: Array<ChatSelection> = []
  type: boolean = false;

  areChats: boolean = false;
  


  constructor(private sharedData: SharedDataService, private chatService: ChatService,
    private router: Router, private restaurantService: RestaurantService, private userService: UserService){
    this.user = this.sharedData.getUser();
    let definitiveID = (this.user.type == "Cliente") ? this.user._id : this.user.restaurant;
    if(this.user.type == "Cliente") this.type = true;
    


    let body = JSON.parse('{"MyID": "' +definitiveID +'", "type": "' + this.user.type + '"}'); 

    this.chatService.getMyChats(body).subscribe((response: any) => {

        if(response.length > 0){
          this.areChats = true;

          let type = (this.user.type == "Cliente") ? true : false //True es cliente, false es restaurant

          for(let i = 0; i < response.length; i++){

            if(type){             
              this.restaurantService.getRestaurant(response[i].restaurantId).subscribe((responseR: any) => {
                this.chatsDisplay[i] = {id: response[i].restaurantId, name: responseR.name, email: "", image: responseR.image}
              });
            } 
            else{
              this.userService.getOneUser(response[i].customerId).subscribe((responseU: any) => {
                this.chatsDisplay[i] = {id: response[i].customerId, name: responseU.name, email: responseU.email, image:responseU.image}
              });
            }

          }

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
