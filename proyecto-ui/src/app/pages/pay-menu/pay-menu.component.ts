import { Component } from '@angular/core';
import {FormGroup, FormBuilder, Validators} from '@angular/forms';
import { Router } from '@angular/router';
import { User } from 'src/app/shared/interfaces/user';
import { SharedDataService } from 'src/app/shared/services/shared-data.service';
import { Card } from 'src/app/shared/interfaces/card';
import { CardService } from 'src/app/shared/services/card.service';

@Component({
  selector: 'app-pay-menu',
  templateUrl: './pay-menu.component.html',
  styleUrls: ['./pay-menu.component.scss']
})
export class PayMenuComponent {
  isLogged: boolean = false;
  user: Array<User> = [];
  areCards: boolean = false;
  cardList: Array<Card> = [];


  constructor(private sharedData: SharedDataService, formBuilder: FormBuilder, private router: Router,private cardService: CardService){
    this.isLogged = sharedData.getLog();
    this.user[0] = sharedData.getUser();

    this.cardService.getCards(this.user[0]._id).subscribe((response: any) => {
      console.log(response);
      if(response.length > 0){//Ya hay tarjetas
        this.cardList = response;
        this.areCards = true;
      }

    });


  }


  redirectDelete(id: String){
    this.sharedData.setCard(id);
    this.router.navigate(['/deletecard']);
  }

  redirectUpdate(id: String){
    this.sharedData.setCard(id);
    this.router.navigate(['/updatecard']);
  }


}
