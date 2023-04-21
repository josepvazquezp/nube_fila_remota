import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

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

const routes: Routes = [
  { path: "", component: HomeComponent },
  { path: "createuser", component: CreateUserComponent },
  { path: "paymenu", component: PayMenuComponent },
  { path: "display_restaurant", component: DisplayRestaurantComponent },
  { path: "update_user", component: UpdateUserComponent },
  { path: "restaurant_products", component: RestaurantProductsComponent },
  { path: "create_product", component: CreateProductComponent },
  { path: "update_product", component: UpdateProductComponent },
  { path: "delete_product", component: DeleteProductComponent },
  { path: "display_order", component: DisplayOrderComponent },
  { path: "order_in_progress", component: OrderInProgressComponent },
  { path: "restaurant_orders", component: RetaurantOrdersComponent }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
