import { Component } from '@angular/core';
import { Router } from '@angular/router';

import { User } from 'src/app/shared/interfaces/user';

import { SharedDataService } from 'src/app/shared/services/shared-data.service';

import { Card } from 'src/app/shared/interfaces/card';
import { CardService } from 'src/app/shared/services/card.service';

@Component({
  selector: 'app-payment-select',
  templateUrl: './payment-select.component.html',
  styleUrls: ['./payment-select.component.scss']
})
export class PaymentSelectComponent {
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

  areCards: boolean = false;
  cardList: Array<Card> = [];

  constructor(private sharedData: SharedDataService, private cardService: CardService, private router: Router){
    this.user = sharedData.getUser();

    this.cardService.getCards(this.user._id).subscribe((response: any) => {
      if(response.length > 0){//Ya hay tarjetas
        this.cardList = response;
        this.areCards = true;
      }

    });
  }

    selectCard(id: String){
    this.sharedData.setCard(id);
    this.router.navigate(['/paymentConfirm']);
  }

  redirectCreate(){
    this.sharedData.setOrigin("paymentSelect")
    this.router.navigate(['/createcard']);
  }



}
