import { Component } from '@angular/core';
import {FormGroup, FormBuilder, Validators} from '@angular/forms';
import { Router } from '@angular/router';
import { User } from 'src/app/shared/interfaces/user';
import { SharedDataService } from 'src/app/shared/services/shared-data.service';
import { Card } from 'src/app/shared/interfaces/card';
import { CardService } from 'src/app/shared/services/card.service';
import { AuthService } from 'src/app/shared/services/auth.service';

@Component({
  selector: 'app-create-card',
  templateUrl: './create-card.component.html',
  styleUrls: ['./create-card.component.scss']
})
export class CreateCardComponent {
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
  cardForm: FormGroup;
  type: string = "Debito";

  constructor(private sharedData: SharedDataService, formBuilder: FormBuilder, private router: Router,private cardService: CardService, private authService: AuthService){
    


    this.user = sharedData.getUser();

    this.cardForm = formBuilder.group({
      number: ['', Validators.required],
      month: ['', Validators.required],
      year: ['', Validators.required]
    });
    

  }

  typeDebito(){
    this.type = "Debito";
  }

  typeCredito(){
    this.type = "Credito";
  }
  
  checkForm(){
    if(!this.cardForm.valid){
      alert("Por favor, llene todos los campos");
    }else{
        this.checkCards();
    }
    
  }

  checkCards(){
    this.cardService.getCardCreate(this.cardForm.value.number).subscribe((response: any) => {
    
      if(response.length == 0){
        this.createCard();  
      }else{
        alert("Ya existe una tarjeta con este número!!");
      }    
    });
  }

  createCard(){

    let defMonth = (this.cardForm.value.month < 10) ? '0' +   this.cardForm.value.month : this.cardForm.value.month.toString()
    let body = JSON.parse('{"ID_User":"'+ this.user._id + '",'+
    '"Type": "'+ this.type +'", "Number": "'+ this.cardForm.value.number + '",'+
    '"Date":"'+defMonth+ '/' +this.cardForm.value.year  +'"}');

    this.cardService.postCard(body).subscribe((response: any) => {
      alert("Tarjeta añadida")
      this.router.navigate([this.sharedData.getOrigin()]);
      
    });

    
  }

  goBack(){
    this.router.navigate([this.sharedData.getOrigin()]);
  }

}
