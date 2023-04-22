import { Component } from '@angular/core';
import {FormGroup, FormBuilder, Validators} from '@angular/forms';
import { Router } from '@angular/router';
import { SharedDataService } from 'src/app/shared/services/shared-data.service';
import { RestaurantService } from 'src/app/shared/services/restaurant.service';
import { ReviewService } from 'src/app/shared/services/review.service';

@Component({
  selector: 'app-setreview',
  templateUrl: './setreview.component.html',
  styleUrls: ['./setreview.component.scss']
})
export class SetreviewComponent {
  review: FormGroup;
  rating: number = 1;
  ratingArr = [1,2,3,4,5];
  customerID: String = "";
  restaurantID: String = "";
  nameR: String = ""


  constructor(private sharedData: SharedDataService, formBuilder: FormBuilder, private router: Router, private restaurantService: RestaurantService, private reviewService: ReviewService){
    this.customerID = sharedData.getUser()._id;
    this.restaurantID = sharedData.getRestaurant();
    this.restaurantService.getRestaurant(this.restaurantID).subscribe((response: any) => {
      this.nameR = response.name;
  });

    this.review = formBuilder.group({
      comment: ['', Validators.required]
    });
  }

  rate(rate: number){
    this.rating = rate;
 
  }

  showIcon(index:number) {
    if (this.rating >= index + 1) {
      return 'star';
    } else {
      return 'star_border';
    }
  }

  checkReview(){
    let body = "";
    let Description = "";
    if(this.review.value.comment == ""){
      Description = "Sin Comentarios"
    }else{
      Description = this.review.value.comment;
    }

    body = '{' +
    '"ID_Evaluator": "' + this.customerID + '",' +
    '"ID_Evaluated": "' + this.restaurantID + '",' +
    '"Rating": ' + this.rating + ',' + 
    '"Description": "' + Description + '"}';   

    this.reviewService.createRating(body).subscribe((restaurant: any) => {
      alert("Reseña Agregada!!!");
      this.router.navigate(['/']);
      
    });


  }

  


}
