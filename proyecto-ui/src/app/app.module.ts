import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { 
  SocialLoginModule, 
  SocialAuthServiceConfig,
  GoogleLoginProvider,
  GoogleSigninButtonModule 
} from '@abacritt/angularx-social-login';


import { enviroment } from 'src/enviroments/enviroment';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { NavComponent } from './layouts/nav/nav.component';
import { HomeComponent } from './pages/home/home.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MaterialModule } from './modules/material/material.module';
import { PayMenuComponent } from './pages/pay-menu/pay-menu.component';
import { CreateUserComponent } from './pages/create-user/create-user.component';
import { DisplayRestaurantComponent } from './pages/display-restaurant/display-restaurant.component';
import { UpdateUserComponent } from './pages/update-user/update-user.component';
import { RestaurantProductsComponent } from './pages/restaurant-products/restaurant-products.component';
import { UpdateProductComponent } from './pages/update-product/update-product.component';
import { DeleteProductComponent } from './pages/delete-product/delete-product.component';
import { CreateProductComponent } from './pages/create-product/create-product.component';
import { DisplayOrderComponent } from './pages/display-order/display-order.component';
import { OrderInProgressComponent } from './pages/order-in-progress/order-in-progress.component';
import { RetaurantOrdersComponent } from './pages/retaurant-orders/retaurant-orders.component';
import { DeleteUserComponent } from './pages/delete-user/delete-user.component';
import { CreateCardComponent } from './pages/create-card/create-card.component';
import { DeleteCardComponent } from './pages/delete-card/delete-card.component';
import { UpdateCardComponent } from './pages/update-card/update-card.component';
import { SetreviewComponent } from './pages/setreview/setreview.component';
import { ChatdisplayComponent } from './pages/chatdisplay/chatdisplay.component';
import { ViewRestaurantsComponent } from './pages/view-restaurants/view-restaurants.component';
import { LoginComponent } from './pages/login/login.component';
import { PaymentSelectComponent } from './pages/payment-select/payment-select.component';
import { PaymentConfirmComponent } from './pages/payment-confirm/payment-confirm.component';
import { ChatSelectComponent } from './pages/chat-select/chat-select.component';
import { SpinnerComponent } from './pages/spinner/spinner.component';

@NgModule({
  declarations: [
    AppComponent,
    NavComponent,
    HomeComponent,
    PayMenuComponent,
    CreateUserComponent,
    DisplayRestaurantComponent,
    UpdateUserComponent,
    RestaurantProductsComponent,
    UpdateProductComponent,
    DeleteProductComponent,
    CreateProductComponent,
    DisplayOrderComponent,
    OrderInProgressComponent,
    RetaurantOrdersComponent,
    DeleteUserComponent,
    UpdateUserComponent,
    CreateCardComponent,
    DeleteCardComponent,
    UpdateCardComponent,
    SetreviewComponent,
    ChatdisplayComponent,
    ViewRestaurantsComponent,
    LoginComponent,
    PaymentSelectComponent,
    PaymentConfirmComponent,
    ChatSelectComponent,
    SpinnerComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    HttpClientModule,
    FormsModule,
    MaterialModule,
    ReactiveFormsModule,
    SocialLoginModule,
    GoogleSigninButtonModule
  ],
  providers: [
    {
      provide: 'SocialAuthServiceConfig',
      useValue: {
        autoLogin: false,
        providers: [
          {
            id: GoogleLoginProvider.PROVIDER_ID,
            provider: new GoogleLoginProvider(
              enviroment.GOOGLE_ID
            )
          }
        ],
        onError: (err) => {
          console.error(err);
        }
      } as SocialAuthServiceConfig,
    }
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
