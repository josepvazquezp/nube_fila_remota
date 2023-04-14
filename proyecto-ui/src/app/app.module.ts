import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { NavComponent } from './layouts/nav/nav.component';
import { HomeComponent } from './pages/home/home.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MaterialModule } from './modules/material/material.module';
import { PayMenuComponent } from './pages/pay-menu/pay-menu.component';
import { CreateUserComponent } from './pages/create-user/create-user.component';

@NgModule({
  declarations: [
    AppComponent,
    NavComponent,
    HomeComponent,
    PayMenuComponent,
    CreateUserComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    HttpClientModule,
    FormsModule,
    MaterialModule,
    ReactiveFormsModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
