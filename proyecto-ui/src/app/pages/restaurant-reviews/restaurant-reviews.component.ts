import { Component } from '@angular/core';
import { User } from 'src/app/shared/interfaces/user';

import { ReviewService } from 'src/app/shared/services/review.service';
import { Rating } from 'src/app/shared/interfaces/rating';
import { ReviewDisplay } from 'src/app/shared/interfaces/review-display';

import { SharedDataService } from 'src/app/shared/services/shared-data.service';
import { Router } from '@angular/router';

import { UserService } from 'src/app/shared/services/user.service';
import { OrderService } from 'src/app/shared/services/order.service';

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


  constructor(private sharedData: SharedDataService, private router: Router,
              private userService: UserService, private ratingService: ReviewService,
              private OrderService: OrderService){
    this.user = this.sharedData.getUser();

    this.ratingService.getRatingR(this.user.restaurant).subscribe((response: any) => {

      if(response.length > 0){
        this.areReviews = true;
        for(let i = 0; i < response.length; i++){
  
          

          this.OrderService.getOrder(response[i].ID_Order).subscribe((responseO: any) => {
            this.userService.getOneUser(response[i].ID_Evaluator).subscribe((responseU: any) => {

              let temp  ={Name: "Test", Image: "ssss", Price: 0, Quantity: 1};
              let tempArray = [];
              let totaltemp = 0;

              for(let i= 0; i < responseO.products.length; i++){
                temp  ={Name: responseO.products[i].product.Name, Image: responseO.products[i].product.Image,
                  Price: responseO.products[i].product.Price, Quantity: responseO.products[i].quantity};
                  tempArray.push(temp);
                totaltemp += (responseO.products[i].product.Price * responseO.products[i].quantity)
              }

              this.myRatingsT[i] = {name: responseU.name, email: responseU.email, image: responseU.image, 
                                    rating: response[i].Rating, description: response[i].Description,
                                    products: tempArray, total: totaltemp };

                                    
            });
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
