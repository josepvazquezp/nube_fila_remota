import { Component } from '@angular/core';
import {FormGroup, FormBuilder, Validators} from '@angular/forms';
import { Router } from '@angular/router';

import { ProductService } from 'src/app/shared/services/product.service';
import { SharedDataService } from 'src/app/shared/services/shared-data.service';

import { enviroment } from 'src/enviroments/enviroment';

@Component({
  selector: 'app-update-product',
  templateUrl: './update-product.component.html',
  styleUrls: ['./update-product.component.scss']
})
export class UpdateProductComponent {
  productForm: FormGroup;
  selectedFile: any = null;
  idProduct: String = "";

  constructor(
        private sharedDataService: SharedDataService, 
        private productService: ProductService, 
        formBuilder: FormBuilder,
        private router: Router) {
    this.idProduct = this.sharedDataService.getProduct();

    this.productForm = formBuilder.group({
      name: [''],
      description: [''],
      price: [''],
      available: ['']
    });
  }

  onFileSelected(event: any): void {
    this.selectedFile = event.target.files[0];
  }

  updateProduct() {
    let body = {};

    if(this.productForm.value.name != '' && this.productForm.value.description == '' && 
       this.productForm.value.price == '' && this.productForm.value.available == '1' &&
       this.selectedFile == null) {
      body = {Name: this.productForm.value.name};
    }
    else if(this.productForm.value.name == '' && this.productForm.value.description != '' && 
            this.productForm.value.price == '' && this.productForm.value.available == '1' &&
            this.selectedFile == null) {
          body = {Description: this.productForm.value.description};
    }
    else if(this.productForm.value.name == '' && this.productForm.value.description == '' && 
            this.productForm.value.price != '' && this.productForm.value.available == '1' &&
            this.selectedFile == null) {
          body = {Price: this.productForm.value.price};
    }
    else if(this.productForm.value.name == '' && this.productForm.value.description == '' && 
            this.productForm.value.price == '' && this.productForm.value.available != '1' &&
            this.selectedFile == null) {
          body = {Available: false};
    }
    else if(this.productForm.value.name != '' && this.productForm.value.description != '' && 
            this.productForm.value.price == '' && this.productForm.value.available == '1' &&
            this.selectedFile == null) {
            body = {Name: this.productForm.value.name, Description: this.productForm.value.description};
    }
    else if(this.productForm.value.name != '' && this.productForm.value.description == '' && 
            this.productForm.value.price != '' && this.productForm.value.available == '1' &&
            this.selectedFile == null) {
            body = {Name: this.productForm.value.name, Price: this.productForm.value.price};
    }
    else if(this.productForm.value.name != '' && this.productForm.value.description == '' && 
            this.productForm.value.price == '' && this.productForm.value.available != '1' &&
            this.selectedFile == null) {
            body = {Name: this.productForm.value.name, Available: false};
    }
    else if(this.productForm.value.name == '' && this.productForm.value.description != '' && 
            this.productForm.value.price != '' && this.productForm.value.available == '1' &&
            this.selectedFile == null) {
            body = {Description: this.productForm.value.description, Price: this.productForm.value.price};
    }
    else if(this.productForm.value.name == '' && this.productForm.value.description != '' && 
            this.productForm.value.price == '' && this.productForm.value.available != '1' &&
            this.selectedFile == null) {
            body = {Description: this.productForm.value.description, Available: false};
    }
    else if(this.productForm.value.name == '' && this.productForm.value.description == '' && 
            this.productForm.value.price != '' && this.productForm.value.available != '1' &&
            this.selectedFile == null) {
            body = {Price: this.productForm.value.price, Available: false};
    }
    else if(this.productForm.value.name != '' && this.productForm.value.description != '' && 
            this.productForm.value.price != '' && this.productForm.value.available == '1' &&
            this.selectedFile == null) {
            body = {
              Name: this.productForm.value.name, 
              Description: this.productForm.value.description,
              Price: this.productForm.value.price
            };
    }
    else if(this.productForm.value.name != '' && this.productForm.value.description != '' && 
            this.productForm.value.price == '' && this.productForm.value.available != '1' &&
            this.selectedFile == null) {
            body = {
              Name: this.productForm.value.name, 
              Description: this.productForm.value.description,
              Available: false
            };
    }
    else if(this.productForm.value.name != '' && this.productForm.value.description == '' && 
            this.productForm.value.price != '' && this.productForm.value.available != '1' &&
            this.selectedFile == null) {
            body = {
              Name: this.productForm.value.name, 
              Price: this.productForm.value.price,
              Available: false
            };
    }
    else if(this.productForm.value.name == '' && this.productForm.value.description != '' && 
            this.productForm.value.price != '' && this.productForm.value.available != '1' &&
            this.selectedFile == null) {
            body = {
              Description: this.productForm.value.description,
              Price: this.productForm.value.price,
              Available: false
            };
    }
    else if(this.productForm.value.name != '' && this.productForm.value.description != '' && 
            this.productForm.value.price != '' && this.productForm.value.available != '1' &&
            this.selectedFile == null) {
            body = {
              Name: this.productForm.value.name, 
              Description: this.productForm.value.description,
              Price: this.productForm.value.price,
              Available: false
            };
    }
    

    if(this.selectedFile == null){
        this.productService.updateProduct(this.idProduct, body).subscribe((response: any) => {
        });
    }
    else {
        let id: any = this.idProduct;
  
        const formData = new FormData();
        formData.append("file", this.selectedFile);
        this.productService.changeImage(formData, id).subscribe((response: any) => {
                if(this.productForm.value.name == '' && this.productForm.value.description == '' && 
                        this.productForm.value.price == '' && this.productForm.value.available == '1' &&
                        this.selectedFile != null) {
                        body = {Image: enviroment.host +  "/image/" + response.image};
                }
                else if(this.productForm.value.name != '' && this.productForm.value.description == '' && 
                        this.productForm.value.price == '' && this.productForm.value.available == '1' &&
                        this.selectedFile != null) {
                        body = {Name: this.productForm.value.name, Image: enviroment.host +  "/image/" + response.image};
                }
                else if(this.productForm.value.name == '' && this.productForm.value.description != '' && 
                        this.productForm.value.price == '' && this.productForm.value.available == '1' &&
                        this.selectedFile != null) {
                        body = {Description: this.productForm.value.description, Image: enviroment.host +  "/image/" + response.image};
                }
                else if(this.productForm.value.name == '' && this.productForm.value.description == '' && 
                        this.productForm.value.price != '' && this.productForm.value.available == '1' &&
                        this.selectedFile != null) {
                        body = {Price: this.productForm.value.price, Image: enviroment.host +  "/image/" + response.image};
                }
                else if(this.productForm.value.name == '' && this.productForm.value.description == '' && 
                        this.productForm.value.price == '' && this.productForm.value.available != '1' &&
                        this.selectedFile != null) {
                        body = {Available: false, Image: enviroment.host +  "/image/" + response.image};
                }
                else if(this.productForm.value.name != '' && this.productForm.value.description != '' && 
                        this.productForm.value.price == '' && this.productForm.value.available == '1' &&
                        this.selectedFile != null) {
                        body = {
                        Name: this.productForm.value.name, 
                        Description: this.productForm.value.description,
                        Image: enviroment.host +  "/image/" + response.image
                        };
                }
                else if(this.productForm.value.name != '' && this.productForm.value.description == '' && 
                        this.productForm.value.price != '' && this.productForm.value.available == '1' &&
                        this.selectedFile != null) {
                        body = {
                        Name: this.productForm.value.name, 
                        Description: this.productForm.value.description,
                        Image: enviroment.host +  "/image/" + response.image
                        };
                }
                else if(this.productForm.value.name == '' && this.productForm.value.description != '' && 
                        this.productForm.value.price == '' && this.productForm.value.available != '1' &&
                        this.selectedFile != null) {
                        body = {
                        Description: this.productForm.value.description,
                        Available: false,
                        Image: enviroment.host +  "/image/" + response.image
                        };
                }
                else if(this.productForm.value.name == '' && this.productForm.value.description == '' && 
                        this.productForm.value.price != '' && this.productForm.value.available != '1' &&
                        this.selectedFile != null) {
                        body = {
                        Price: this.productForm.value.price,
                        Available: false,
                        Image: enviroment.host +  "/image/" + response.image
                        };
                }
                else if(this.productForm.value.name != '' && this.productForm.value.description == '' && 
                        this.productForm.value.price != '' && this.productForm.value.available != '1' &&
                        this.selectedFile != null) {
                        body = {
                        Name: this.productForm.value.name, 
                        Price: this.productForm.value.price,
                        Available: false,
                        Image: enviroment.host +  "/image/" + response.image
                        };
                }
                else if(this.productForm.value.name == '' && this.productForm.value.description != '' && 
                        this.productForm.value.price != '' && this.productForm.value.available != '1' &&
                        this.selectedFile != null) {
                        body = {
                        Description: this.productForm.value.description,
                        Price: this.productForm.value.price,
                        Available: false,
                        Image: enviroment.host +  "/image/" + response.image
                        };
                }
                else if(this.productForm.value.name != '' && this.productForm.value.description != '' && 
                        this.productForm.value.price == '' && this.productForm.value.available != '1' &&
                        this.selectedFile != null) {
                        body = {
                        Name: this.productForm.value.name, 
                        Description: this.productForm.value.description,
                        Available: false,
                        Image: enviroment.host +  "/image/" + response.image
                        };
                }
                else if(this.productForm.value.name != '' && this.productForm.value.description != '' && 
                        this.productForm.value.price != '' && this.productForm.value.available == '1' &&
                        this.selectedFile != null) {
                        body = {
                        Name: this.productForm.value.name, 
                        Description: this.productForm.value.description,
                        Price: this.productForm.value.price,
                        Image: enviroment.host +  "/image/" + response.image
                        };
                }
                this.productService.updateProduct(id, body).subscribe(response => {
                        this.router.navigate(["/restaurant_products"]); 
                });
        });
    }
  }

}
