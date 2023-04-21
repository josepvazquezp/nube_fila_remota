import { Component } from '@angular/core';
import {FormGroup, FormBuilder, Validators} from '@angular/forms';

import { ProductService } from 'src/app/shared/services/product.service';
import { SharedDataService } from 'src/app/shared/services/shared-data.service';

@Component({
  selector: 'app-update-product',
  templateUrl: './update-product.component.html',
  styleUrls: ['./update-product.component.scss']
})
export class UpdateProductComponent {
  productForm: FormGroup;
  selectedFile: any = null;
  idProduct: String = "";

  constructor(private sharedDataService: SharedDataService, private productService: ProductService, formBuilder: FormBuilder) {
    this.idProduct = this.sharedDataService.getProduct();

    this.productForm = formBuilder.group({
      name: [''],
      description: [''],
      price: [''],
      available: ['']
    });
  }

  onFileSelected(event: any): void {
    this.selectedFile = event.target.files[0] ?? null;
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
    else if(this.productForm.value.name == '' && this.productForm.value.description == '' && 
            this.productForm.value.price == '' && this.productForm.value.available == '1' &&
            this.selectedFile != null) {
          body = {Image: ''};
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
    else if(this.productForm.value.name != '' && this.productForm.value.description == '' && 
            this.productForm.value.price == '' && this.productForm.value.available == '1' &&
            this.selectedFile != null) {
            body = {Name: this.productForm.value.name, Image: ''};
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
    else if(this.productForm.value.name == '' && this.productForm.value.description != '' && 
            this.productForm.value.price == '' && this.productForm.value.available == '1' &&
            this.selectedFile != null) {
            body = {Description: this.productForm.value.description, Image: ''};
    }
    else if(this.productForm.value.name == '' && this.productForm.value.description == '' && 
            this.productForm.value.price != '' && this.productForm.value.available != '1' &&
            this.selectedFile == null) {
            body = {Price: this.productForm.value.price, Available: false};
    }
    else if(this.productForm.value.name == '' && this.productForm.value.description == '' && 
            this.productForm.value.price != '' && this.productForm.value.available == '1' &&
            this.selectedFile != null) {
            body = {Price: this.productForm.value.price, Image: ''};
    }
    else if(this.productForm.value.name == '' && this.productForm.value.description == '' && 
            this.productForm.value.price == '' && this.productForm.value.available != '1' &&
            this.selectedFile != null) {
            body = {Available: false, Image: ''};
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
    else if(this.productForm.value.name != '' && this.productForm.value.description != '' && 
            this.productForm.value.price == '' && this.productForm.value.available == '1' &&
            this.selectedFile != null) {
            body = {
              Name: this.productForm.value.name, 
              Description: this.productForm.value.description,
              Image: ''
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
    else if(this.productForm.value.name != '' && this.productForm.value.description == '' && 
            this.productForm.value.price != '' && this.productForm.value.available == '1' &&
            this.selectedFile != null) {
            body = {
              Name: this.productForm.value.name, 
              Description: this.productForm.value.description,
              Image: ''
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
    else if(this.productForm.value.name == '' && this.productForm.value.description != '' && 
            this.productForm.value.price == '' && this.productForm.value.available != '1' &&
            this.selectedFile != null) {
            body = {
              Description: this.productForm.value.description,
              Available: false,
              Image: ''
            };
    }
    else if(this.productForm.value.name == '' && this.productForm.value.description == '' && 
            this.productForm.value.price != '' && this.productForm.value.available != '1' &&
            this.selectedFile != null) {
            body = {
              Price: this.productForm.value.price,
              Available: false,
              Image: ''
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
    else if(this.productForm.value.name != '' && this.productForm.value.description == '' && 
            this.productForm.value.price != '' && this.productForm.value.available != '1' &&
            this.selectedFile != null) {
            body = {
              Name: this.productForm.value.name, 
              Price: this.productForm.value.price,
              Available: false,
              Image: '' 
            };
    }
    else if(this.productForm.value.name == '' && this.productForm.value.description != '' && 
            this.productForm.value.price != '' && this.productForm.value.available != '1' &&
            this.selectedFile != null) {
            body = {
              Description: this.productForm.value.description,
              Price: this.productForm.value.price,
              Available: false,
              Image: '' 
            };
    }
    else if(this.productForm.value.name != '' && this.productForm.value.description != '' && 
            this.productForm.value.price == '' && this.productForm.value.available != '1' &&
            this.selectedFile != null) {
            body = {
              Name: this.productForm.value.name, 
              Description: this.productForm.value.description,
              Available: false,
              Image: '' 
            };
    }
    else if(this.productForm.value.name != '' && this.productForm.value.description != '' && 
            this.productForm.value.price != '' && this.productForm.value.available == '1' &&
            this.selectedFile != null) {
            body = {
              Name: this.productForm.value.name, 
              Description: this.productForm.value.description,
              Price: this.productForm.value.price,
              Image: '' 
            };
    }

    this.productService.updateProduct(this.idProduct, body).subscribe((response: any) => {
    });
  }

}
