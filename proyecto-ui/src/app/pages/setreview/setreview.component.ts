import { Component } from '@angular/core';
import {FormGroup, FormBuilder, Validators} from '@angular/forms';
import { Router } from '@angular/router';
import { SharedDataService } from 'src/app/shared/services/shared-data.service';

@Component({
  selector: 'app-setreview',
  templateUrl: './setreview.component.html',
  styleUrls: ['./setreview.component.scss']
})
export class SetreviewComponent {
  review: FormGroup;
  rating: number = 1;
  ratingArr = [1,2,3,4,5];


  constructor(private sharedData: SharedDataService, formBuilder: FormBuilder, private router: Router){
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

    let temp1 = "Aqui va el user"
    let temp2 = "Aqui va el evaluado"


    body = '{' +
    '"ID_Evaluator": "' + temp1 + '",' +
    '"ID_Evaluated": "' + temp2 + '",' +
    '"Rating": ' + this.rating + ',' + 
    '"Description": "' + Description + '"}';   

    console.log(body)

    //Ahora solo es enviarlo a la reseña


  }

  


}
