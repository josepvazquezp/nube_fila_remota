import { Component } from '@angular/core';

import { SharedDataService } from 'src/app/shared/services/shared-data.service';
import { OrderService } from 'src/app/shared/services/order.service';
import { Restaurant } from 'src/app/shared/interfaces/restaurant';
import { RestaurantService } from 'src/app/shared/services/restaurant.service';

import { enviroment } from 'src/enviroments/enviroment';
import { io } from 'socket.io-client';

@Component({
  selector: 'app-order-in-progress',
  templateUrl: './order-in-progress.component.html',
  styleUrls: ['./order-in-progress.component.scss']
})
export class OrderInProgressComponent {
  idOrder: String = "";
  actualOrder: number = 0;
  socket: any;

  constructor(private sharedDataService: SharedDataService, private orderService: OrderService, private restaurantService: RestaurantService) {
    this.idOrder = this.sharedDataService.getOrder();

    this.orderService.getOrder(this.idOrder).subscribe((response: any) => {

      this.restaurantService.getRestaurant(response.products[0].product.RestaurantId).subscribe((restaurant: any) => {
        let orders: Array<{_id: String}> = restaurant.orders;
        let index = orders.findIndex(item => item._id == this.idOrder)
        this.actualOrder =  index + 1;
        
      });
    
    });
  }

  ngOnInit(){
    this.socket = io(enviroment.host);
    this.socket.on("receiveStatus", (data: any) => {
      console.log("Status: " + data.status) 

      if(data.status == 'aceptada') {
        document.getElementById('aceptada')?.click();
      }
      else if(data.status == 'lista'){
        document.getElementById('lista')?.click();
      }
      else if(data.status == 'finalizada'){
        document.getElementById('finalizada')?.click();
      }
      
    });
  }


}
