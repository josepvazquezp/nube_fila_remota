import { Component } from '@angular/core';
import {FormGroup, FormBuilder, Validators} from '@angular/forms';
import { Router } from '@angular/router';
import { User } from 'src/app/shared/interfaces/user';
import { SharedDataService } from 'src/app/shared/services/shared-data.service';
import { Card } from 'src/app/shared/interfaces/card';
import { CardService } from 'src/app/shared/services/card.service';

@Component({
  selector: 'app-delete-card',
  templateUrl: './delete-card.component.html',
  styleUrls: ['./delete-card.component.scss']
})
export class DeleteCardComponent {
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
  isCard: boolean = false;
  card: Array<Card> = [];
  id: String = "";

  formDelete: FormGroup;


  constructor(private sharedData: SharedDataService, formBuilder: FormBuilder, private router: Router,private cardService: CardService){
    this.formDelete = formBuilder.group({
      check: [false, Validators.requiredTrue]
    });
    
    this.isLogged = sharedData.getLog();
    this.user = sharedData.getUser();
    this.id = sharedData.getCard();
    this.cardService.getOneCard(this.id).subscribe((response: any) => {
      this.card[0] = response;
    
    });
  }


  checkDelete(){
    if(!this.formDelete.valid){
      alert("Por favor, acepte los términos.");
    }else{
      this.deleteCard();
    }
  }


  deleteCard(){
    this.cardService.deleteCard(this.id).subscribe((response: any) => {
      alert("Tarjeta Eliminada")
      this.router.navigate(['/paymenu']);
    });
  } 
  
}
