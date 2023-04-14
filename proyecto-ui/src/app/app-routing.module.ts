import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './pages/home/home.component';
import { PayMenuComponent } from './pages/pay-menu/pay-menu.component';
import { CreateUserComponent } from './pages/create-user/create-user.component';

const routes: Routes = [
  {path: "", component: HomeComponent},
  {path: "createuser", component: CreateUserComponent},
  {path: "paymenu", component: PayMenuComponent}

];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
