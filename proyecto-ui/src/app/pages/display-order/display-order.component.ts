import { Component } from '@angular/core';

import { OrderService } from 'src/app/shared/services/order.service';

@Component({
  selector: 'app-display-order',
  templateUrl: './display-order.component.html',
  styleUrls: ['./display-order.component.scss']
})
export class DisplayOrderComponent {
  products: Array<Object> = [];

  idCustomer: String = "64399dacddc3bcf1989b709b";
  idOrder: String = "643c5fafbc06c4deb2916f9a";

  constructor(private orderService: OrderService) {
      this.orderService.getOrder(this.idOrder).subscribe((response: any) => {
      this.products = response.products;
    });
  }
}
