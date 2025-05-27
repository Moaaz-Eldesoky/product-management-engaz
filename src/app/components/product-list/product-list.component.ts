import { Component, OnInit } from '@angular/core';
import { ProductService } from '../../services/product.service';
import { Product } from '../../interfaces/product.interface';
@Component({
  selector: 'app-product-list',
  imports: [],
  templateUrl: './product-list.component.html',
  styleUrl: './product-list.component.css',
})
export class ProductListComponent implements OnInit {
  products: Product[] = [];
  searchKeyWord: string = '';
  currentPage: number = 1;
  itemsPerPage: number = 10;
  constructor(private productService: ProductService) {}
  ngOnInit() {
    this.getProducts();
  }
  getProducts(): void {
    this.productService.getProducts().subscribe({
      next: (res: Product[]) => {
        this.products = res;
      },
      error: (err) => {
        console.error('Error fetching products:', err);
      },
    });
  }
  searchProducts(): void {
    if (this.searchKeyWord.trim() === '') {
      this.getProducts();
    } else {
      this.products = this.products.filter((product) =>
        product.title.toLowerCase().includes(this.searchKeyWord.toLowerCase())
      );
    }
  }
  resetSearch(): void {
    this.searchKeyWord = '';
    this.getProducts();
  }
  get paginatedProducts(): Product[] {
    const startIndex = (this.currentPage - 1) * this.itemsPerPage;
    return this.products.slice(startIndex, startIndex + this.itemsPerPage);
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
}
