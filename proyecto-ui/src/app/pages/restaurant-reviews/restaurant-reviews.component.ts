import { Component } from '@angular/core';
import { User } from 'src/app/shared/interfaces/user';

import { ReviewService } from 'src/app/shared/services/review.service';
import { Rating } from 'src/app/shared/interfaces/rating';
import { ReviewDisplay } from 'src/app/shared/interfaces/review-display';

import { SharedDataService } from 'src/app/shared/services/shared-data.service';
import { Router } from '@angular/router';

import { UserService } from 'src/app/shared/services/user.service';

@Component({
  selector: 'app-restaurant-reviews',
  templateUrl: './restaurant-reviews.component.html',
  styleUrls: ['./restaurant-reviews.component.scss']
})
export class RestaurantReviewsComponent {
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
  myRatingsT: Array<ReviewDisplay> = []
  areReviews: boolean = false;

  ratingArr = [1,2,3,4,5];


  constructor(private sharedData: SharedDataService, private router: Router, private userService: UserService, private ratingService: ReviewService){
    this.user = this.sharedData.getUser();

    this.ratingService.getRatingR(this.user.restaurant).subscribe((response: any) => {
      console.log(response)

      if(response.length > 0){
        this.areReviews = true;
        for(let i = 0; i < response.length; i++){
          this.userService.getOneUser(response[i].ID_Evaluator).subscribe((responseU: any) => {
            this.myRatingsT[i] = {name: responseU.name, email: responseU.email, image: responseU.image, rating: response[i].Rating, description: response[i].Description};
          });
        }

      }
    });
  }


  showStar(index: number, rating: number){
    if (rating >= index + 1) {
      return true;
    } else{
      return false;
    }
  }


}
