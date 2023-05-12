import { Component } from '@angular/core';
import { Router } from '@angular/router';

import { FormGroup, FormBuilder, Validators } from '@angular/forms';

import { enviroment } from 'src/enviroments/enviroment';

import { ProductService } from 'src/app/shared/services/product.service';
import { SharedDataService } from 'src/app/shared/services/shared-data.service';

@Component({
  selector: 'app-create-product',
  templateUrl: './create-product.component.html',
  styleUrls: ['./create-product.component.scss']
})
export class CreateProductComponent {
  productForm: FormGroup;
  selectedFile: any = null;
  idRestaurant: String = "";

  constructor(
    private sharedDataService: SharedDataService, 
    private productService: ProductService, 
    private formBuilder: FormBuilder, 
    private router: Router) {
    this.idRestaurant = this.sharedDataService.getUserRestaurant();
    
    this.productForm = formBuilder.group({
      name: ['', Validators.required],
      description: ['', Validators.required],
      price: ['', Validators.required]
    });
  }

  onFileSelected(event: any): void {
    this.selectedFile = event.target.files[0];
  }

  createProduct() {
    let body = {
      Name: this.productForm.value.name,
      Description: this.productForm.value.description,
      Price: this.productForm.value.price,
      RestaurantId: this.idRestaurant
    }

    if(this.productForm.value != '' || this.selectedFile != null) {
      this.productService.createProduct(body).subscribe((response: any) => {
        let id: any = response.product._id;
        console.log(response.product._id);
  
        const formData = new FormData();
        formData.append("file", this.selectedFile);
        this.productService.changeImage(formData, id).subscribe((response: any) => {
          let body = {Image: enviroment.host +  "/image/" + response.image};
          
          this.productService.updateProduct(id, body).subscribe((response: any) => {
            this.router.navigate(['/restaurant_products']);
          });
        });
      });
    }
  }

}
