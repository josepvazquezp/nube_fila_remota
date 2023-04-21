import { Component } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';

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

  constructor(private sharedDataService: SharedDataService, private productService: ProductService, formBuilder: FormBuilder) {
    this.idRestaurant = this.sharedDataService.getUserRestaurant();
    
    this.productForm = formBuilder.group({
      name: ['', Validators.required],
      description: ['', Validators.required],
      price: ['', Validators.required]
    });
  }

  onFileSelected(event: any): void {
    this.selectedFile = event.target.files[0] ?? null;
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
      });
    }
  }

}
