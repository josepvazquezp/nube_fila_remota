import { Component } from '@angular/core';
import {FormGroup, FormBuilder, Validators} from '@angular/forms';
import { Router } from '@angular/router';
import { User } from 'src/app/shared/interfaces/user';
import { SharedDataService } from 'src/app/shared/services/shared-data.service';
import { Card } from 'src/app/shared/interfaces/card';
import { CardService } from 'src/app/shared/services/card.service';

@Component({
  selector: 'app-payment-confirm',
  templateUrl: './payment-confirm.component.html',
  styleUrls: ['./payment-confirm.component.scss']
})
export class PaymentConfirmComponent {
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

  card: Card = {
    _id: "",
    ID_User: "",
    Type: "",
    Date: "",
    Number: ""
  }

  checkSecurityCode: FormGroup;

  constructor(private sharedData: SharedDataService, formBuilder: FormBuilder, private router: Router,private cardService: CardService){
    
    this.user = sharedData.getUser();

    this.cardService.getOneCard(this.sharedData.getCard()).subscribe((response: any) => {
      this.card = response;
    
    });

    this.checkSecurityCode = formBuilder.group({
      secCode:['', Validators.required]
    });
  }


  checkGivenSecurityCode(){//Por obvias razones, esta función no esta conectada a un banco de verdad
    if(this.checkSecurityCode.valid){
      alert("Pago Realizado")//Aquí es donde sería redireccionar a los estados de la orden, el Router ya esta instalado aquí
    }else{
      alert("Por favor, introduzca los tres dígitos correctamente")
    }

  }


}
