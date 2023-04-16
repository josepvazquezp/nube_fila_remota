import { Component } from '@angular/core';

import { ProductService } from 'src/app/shared/services/product.service';

@Component({
  selector: 'app-delete-product',
  templateUrl: './delete-product.component.html',
  styleUrls: ['./delete-product.component.scss']
})
export class DeleteProductComponent {
  name: String = '';
  image: String = '';
  description: String = '';
  price: Number = 0;

  rName: String = '';
  rImage: String = '';

  delete: String = '';
  idProduct: String = "643c448985154b19a05d33bb";

  constructor(private productService: ProductService) {
      this.productService.getProduct(this.idProduct).subscribe((response: any) => {
      this.name = response.Name;
      this.image = response.Image;
      this.description = response.Description;
      this.price = response.Price;

      this.rName = response.RestaurantId.name;
      this.rImage = response.RestaurantId.image;
    });
  }

  deleteProduct() {
    if(this.delete == '1') {
      this.productService.deleteProduct(this.idProduct).subscribe((response: any) => {
      });
    }
  }
}
