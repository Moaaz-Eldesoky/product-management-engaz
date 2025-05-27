import { Component, OnInit } from '@angular/core';
import { ProductService } from '../../services/product.service';
import { Product } from '../../interfaces/product.interface';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { DialogModule } from 'primeng/dialog';
import { ProductFormComponent } from '../product-form/product-form.component';

@Component({
  selector: 'app-product-list',
  imports: [
    CommonModule,
    FormsModule,
    RouterModule,
    ProductFormComponent,
    DialogModule,
  ],
  templateUrl: './product-list.component.html',
  styleUrl: './product-list.component.css',
})
export class ProductListComponent implements OnInit {
  products: Product[] = [];
  allProducts: Product[] = [];
  searchKeyWord: string = '';
  selectedProductID!: number;
  displayEditDialog: boolean = false;

  constructor(private productService: ProductService) {}
  ngOnInit() {
    this.getProducts();
  }
  getProducts(): void {
    this.productService.getProducts().subscribe({
      next: (res: Product[]) => {
        this.allProducts = res;
        this.products = [...res];
      },
      error: (err) => {
        console.error('Error fetching products:', err);
      },
    });
  }

  searchProducts(): void {
    const keyword = this.searchKeyWord.trim().toLowerCase();
    if (!keyword) {
      this.products = [...this.allProducts];
    } else {
      this.products = this.allProducts.filter((product) =>
        product.title.toLowerCase().includes(keyword)
      );
    }
  }

  resetSearch(): void {
    this.searchKeyWord = '';
    this.products = [...this.allProducts];
  }

  deleteProduct(id: number): void {
    this.productService.deleteProduct(id).subscribe({
      next: () => {
        this.products = this.products.filter((product) => product.id !== id);
      },
      error: (err) => {
        console.error('Error deleting product:', err);
      },
    });
  }
  updateProduct(id: number, updatedProduct: Product): void {
    this.productService.updateProduct(id, updatedProduct).subscribe({
      next: (res) => {
        const index = this.products.findIndex((product) => product.id === id);
        if (index !== -1) {
          this.products[index] = res;
        }
      },
      error: (err) => {
        console.error('Error updating product:', err);
      },
    });
  }
  openEditDialog(product: Product): void {
    this.selectedProductID = product.id;
    this.displayEditDialog = true;
  }

  onProductUpdated(updated: Product): void {
    this.displayEditDialog = false;
    if (!updated) return;

    this.updateProduct(updated.id, updated);
  }
}
