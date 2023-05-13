import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { User } from 'src/app/shared/interfaces/user';
import { SharedDataService } from 'src/app/shared/services/shared-data.service';
import { Card } from 'src/app/shared/interfaces/card';
import { CardService } from 'src/app/shared/services/card.service';
import { AuthService } from 'src/app/shared/services/auth.service';

@Component({
  selector: 'app-pay-menu',
  templateUrl: './pay-menu.component.html',
  styleUrls: ['./pay-menu.component.scss']
})
export class PayMenuComponent {
  isLogged: boolean = false;
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


  constructor(private sharedData: SharedDataService, private router: Router,private cardService: CardService, private authService: AuthService){


    this.user = sharedData.getUser();

    this.cardService.getCards(this.user._id).subscribe((response: any) => {

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

  redirectCreate(){
    this.sharedData.setOrigin("paymenu")
    this.router.navigate(['/createcard']);
  }

}
