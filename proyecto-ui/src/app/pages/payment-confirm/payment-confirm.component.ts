import { Component } from '@angular/core';
import {FormGroup, FormBuilder, Validators} from '@angular/forms';
import { Router } from '@angular/router';

import { User } from 'src/app/shared/interfaces/user';
import { SharedDataService } from 'src/app/shared/services/shared-data.service';
import { Card } from 'src/app/shared/interfaces/card';
import { CardService } from 'src/app/shared/services/card.service';
import { OrderService } from 'src/app/shared/services/order.service';
import { Restaurant } from 'src/app/shared/interfaces/restaurant';
import { RestaurantService } from 'src/app/shared/services/restaurant.service';

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

  restaurant: Restaurant = {
    _id: '',
    name: '',
    email: '',
    products: [],
    description: '',
    type: '',
    location: '',
    image: '',
    orders: []
  };

  idOrder: String = "";

  checkSecurityCode: FormGroup;

  constructor(
    private sharedData: SharedDataService, 
    private formBuilder: FormBuilder, 
    private router: Router,
    private cardService: CardService,
    private orderService: OrderService,
    private restaurantService: RestaurantService
    ){
    
    this.user = sharedData.getUser();
    this.idOrder = this.sharedData.getOrder();

    this.cardService.getOneCard(this.sharedData.getCard()).subscribe((response: any) => {
      this.card = response;
    
    });

    this.orderService.getOrder(this.idOrder).subscribe((response: any) => {
      this.restaurantService.getRestaurant(response.restaurantId).subscribe((response: any) => {
        this.restaurant = response;
      });
    });

    this.checkSecurityCode = formBuilder.group({
      secCode:['', Validators.required]
    });
  }


  checkGivenSecurityCode(){//Por obvias razones, esta función no esta conectada a un banco de verdad
    if(this.checkSecurityCode.valid){
      alert("Pago Realizado")//Aquí es donde sería redireccionar a los estados de la orden, el Router ya esta instalado aquí
      this.restaurant.orders.push(this.idOrder);
  
      let body = {orders: this.restaurant.orders}
      
      this.restaurantService.updateRestaurant(this.restaurant._id, body).subscribe((response: any) => {
        this.router.navigate(['/order_in_progress']);
      });
  }else{
      alert("Por favor, introduzca los tres dígitos correctamente")
    }

  }


}
