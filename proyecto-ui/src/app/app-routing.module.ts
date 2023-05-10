import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

//Paginas
import { HomeComponent } from './pages/home/home.component';
import { PayMenuComponent } from './pages/pay-menu/pay-menu.component';
import { CreateUserComponent } from './pages/create-user/create-user.component';
import { DisplayRestaurantComponent } from './pages/display-restaurant/display-restaurant.component';
import { UpdateUserComponent } from './pages/update-user/update-user.component';
import { RestaurantProductsComponent } from './pages/restaurant-products/restaurant-products.component';
import { CreateProductComponent } from './pages/create-product/create-product.component';
import { UpdateProductComponent } from './pages/update-product/update-product.component';
import { DeleteProductComponent } from './pages/delete-product/delete-product.component';
import { DisplayOrderComponent } from './pages/display-order/display-order.component';
import { OrderInProgressComponent } from './pages/order-in-progress/order-in-progress.component';
import { RetaurantOrdersComponent } from './pages/retaurant-orders/retaurant-orders.component';
import { DeleteUserComponent } from './pages/delete-user/delete-user.component';
import { CreateCardComponent } from './pages/create-card/create-card.component';
import { DeleteCardComponent } from './pages/delete-card/delete-card.component';
import { UpdateCardComponent } from './pages/update-card/update-card.component';
import { ChatdisplayComponent } from './pages/chatdisplay/chatdisplay.component';
import { SetreviewComponent } from './pages/setreview/setreview.component';
import { ViewRestaurantsComponent } from './pages/view-restaurants/view-restaurants.component';
import { LoginComponent } from './pages/login/login.component';


//Guardias
import { AuthGuard } from './shared/guards/auth.guard';
import { PaymentSelectComponent } from './pages/payment-select/payment-select.component';
import { PaymentConfirmComponent } from './pages/payment-confirm/payment-confirm.component';
import { ChatSelectComponent } from './pages/chat-select/chat-select.component';

const routes: Routes = [
  { path: "", component: HomeComponent },
  { path: "createuser", component: CreateUserComponent },
  { path: "paymenu", component: PayMenuComponent, canActivate: [AuthGuard] },
  { path: "display_restaurant", component: DisplayRestaurantComponent },
  { path: "update_user", component: UpdateUserComponent, canActivate: [AuthGuard]},
  { path: "restaurant_products", component: RestaurantProductsComponent, canActivate: [AuthGuard], data:{
    type: 'Restaurant'
  } },
  { path: "create_product", component: CreateProductComponent, canActivate: [AuthGuard], data:{
    type: 'Restaurant'
  }  },
  { path: "update_product", component: UpdateProductComponent, canActivate: [AuthGuard], data:{
    type: 'Restaurant'
  }  },
  { path: "delete_product", component: DeleteProductComponent, canActivate: [AuthGuard], data:{
    type: 'Restaurant'
  }  },
  { path: "display_order", component: DisplayOrderComponent, canActivate: [AuthGuard], data:{
    type: 'Restaurant'
  }  },
  { path: "order_in_progress", component: OrderInProgressComponent, canActivate: [AuthGuard], data:{
    type: 'Restaurant'
  }  },
  { path: "restaurant_orders", component: RetaurantOrdersComponent, canActivate: [AuthGuard], data:{
    type: 'Restaurant'
  }  },
  { path: "createuser", component: CreateUserComponent },
  { path: "deleteuser", component: DeleteUserComponent, canActivate: [AuthGuard]  },
  { path: "paymenu", component: PayMenuComponent, canActivate: [AuthGuard]  },
  { path: "createcard", component: CreateCardComponent, canActivate: [AuthGuard]  },
  { path: "deletecard", component: DeleteCardComponent, canActivate: [AuthGuard]  },
  { path: "updatecard", component: UpdateCardComponent, canActivate: [AuthGuard]  },
  { path: "chat", component: ChatdisplayComponent, canActivate: [AuthGuard]  },
  { path: "review", component: SetreviewComponent, canActivate: [AuthGuard]  },
  { path: "view_restaurants", component: ViewRestaurantsComponent},
  { path: "login", component: LoginComponent },
  { path: "paymentSelect", component: PaymentSelectComponent, canActivate: [AuthGuard]},
  { path: "paymentConfirm", component : PaymentConfirmComponent, canActivate: [AuthGuard]},
  { path: "chatSelect", component: ChatSelectComponent, canActivate: [AuthGuard]}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
