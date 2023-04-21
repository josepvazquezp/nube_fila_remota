import { Component, ElementRef, ViewChild } from '@angular/core';
import {FormGroup, FormBuilder, Validators} from '@angular/forms';
import { Router } from '@angular/router';
import { SharedDataService } from 'src/app/shared/services/shared-data.service';
import { Chat } from 'src/app/shared/interfaces/chat';
import { ChatService } from 'src/app/shared/services/chat.service';
import { User } from 'src/app/shared/interfaces/user';
import { Message } from 'src/app/shared/interfaces/message';

@Component({
  selector: 'app-chatdisplay',
  templateUrl: './chatdisplay.component.html',
  styleUrls: ['./chatdisplay.component.scss']
})
export class ChatdisplayComponent {
  message: FormGroup;
  chatready = false;
  thisChat: Array<Chat> = []


  user: Array<User> = [];
  

  constructor(private sharedData: SharedDataService, formBuilder: FormBuilder, private router: Router, private chatService: ChatService){
    this.message = formBuilder.group({
      message: ['', Validators.required]
    });
    this.user[0] = sharedData.getUser();


    let body = JSON.parse('{"MyID": "' + this.user[0]._id +'"}');
    this.chatService.getChat(body).subscribe((response: any) => {
      console.log(response);
      this.thisChat = response;
      console.log(this.thisChat[0])
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
      
      

      let body = JSON.parse('{"sender": "' + this.user[0].name + '", "message": "' + this.message.value.message + '"}');
      this.clearMessage();
      console.log(body)
      this.chatService.putMessage(body, this.thisChat[0]._id).subscribe((response: any) => {

        this.thisChat[0] = response;


          });

    }
  }

}
