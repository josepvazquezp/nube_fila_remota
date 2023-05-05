import { Component } from '@angular/core';
import {FormGroup, FormBuilder, Validators} from '@angular/forms';
import { Router } from '@angular/router';
import { User } from 'src/app/shared/interfaces/user';
import { SharedDataService } from 'src/app/shared/services/shared-data.service';
import { Card } from 'src/app/shared/interfaces/card';
import { CardService } from 'src/app/shared/services/card.service';


@Component({
  selector: 'app-update-card',
  templateUrl: './update-card.component.html',
  styleUrls: ['./update-card.component.scss']
})
export class UpdateCardComponent {
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

  updateForm: FormGroup;
  type: string = "Debito";

  constructor(private sharedData: SharedDataService, formBuilder: FormBuilder, private router: Router,private cardService: CardService){
    
    this.isLogged = sharedData.getLog();
    this.user = sharedData.getUser();
    this.id = sharedData.getCard();
    this.updateForm = formBuilder.group({
      number: [''],
      month: [''],
      year: ['']
    });
    this.cardService.getOneCard(this.id).subscribe((response: any) => {
      this.card[0] = response;
    
    });
  }


  typeDebito(){
    this.type = "Debito";
  }

  typeCredito(){
    this.type = "Credito";
  }

  checkForm(){

    let body = "{";
    body += '"Type": "' + this.type + '"';
    let tempMonth = this.card[0].Date.substring(0,2);
    let tempYear = this.card[0].Date.substring(3,5);
    console.log(tempMonth);
    console.log(tempYear);

    body += (this.updateForm.value.number != "" && this.updateForm.value.number.length == 16) ? ',"Number": "' + this.updateForm.value.number  + '"': ',"Number": "' + this.card[0].Number + '"';
    console.log(body);
    
    body += (this.updateForm.value.month != ""  && this.updateForm.value.month >=  1 && this.updateForm.value.month <= 12) ? ',"Date": "' + 
    ((this.updateForm.value.month < 10) ? '0' +   this.updateForm.value.month : this.updateForm.value.month.toString())  + '/': ',"Date": "' + tempMonth + '/';
    console.log(body);
    
    body += (this.updateForm.value.year != "" && this.updateForm.value.year >=  23 && this.updateForm.value.year <= 99) ? this.updateForm.value.year : tempYear;


    body += '"}';

    let Jsonbody = JSON.parse(body);
    this.cardService.putCard(Jsonbody, this.id).subscribe((response: any) => {
      alert("Tarjeta Modificada")
      this.router.navigate(['/paymenu']);
    
    });
    
  }

}
