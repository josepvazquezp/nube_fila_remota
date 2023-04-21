import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './pages/home/home.component';
import { PayMenuComponent } from './pages/pay-menu/pay-menu.component';
import { CreateUserComponent } from './pages/create-user/create-user.component';
import { DeleteUserComponent } from './pages/delete-user/delete-user.component';
import { UpdateUserComponent } from './pages/update-user/update-user.component';
import { CreateCardComponent } from './pages/create-card/create-card.component';
import { DeleteCardComponent } from './pages/delete-card/delete-card.component';
import { UpdateCardComponent } from './pages/update-card/update-card.component';
import { ChatdisplayComponent } from './pages/chatdisplay/chatdisplay.component';
import { SetreviewComponent } from './pages/setreview/setreview.component';

const routes: Routes = [
  {path: "", component: HomeComponent},
  {path: "createuser", component: CreateUserComponent},
  {path: "deleteuser", component: DeleteUserComponent},
  {path: "updateuser", component: UpdateUserComponent},
  {path: "paymenu", component: PayMenuComponent},
  {path: "createcard", component: CreateCardComponent},
  {path: "deletecard", component: DeleteCardComponent},
  {path: "updatecard", component: UpdateCardComponent},
  {path: "chat", component: ChatdisplayComponent},
  {path: "review", component: SetreviewComponent}

];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
