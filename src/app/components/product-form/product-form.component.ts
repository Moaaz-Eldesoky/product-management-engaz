import { Component, Input, OnInit, SimpleChanges } from '@angular/core';
import {
  FormGroup,
  FormBuilder,
  Validators,
  FormsModule,
  ReactiveFormsModule,
} from '@angular/forms';
import { ProductService } from '../../services/product.service';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterModule } from '@angular/router';

@Component({
  selector: 'app-product-form',
  imports: [CommonModule, FormsModule, ReactiveFormsModule, RouterModule],
  templateUrl: './product-form.component.html',
  styleUrl: './product-form.component.css',
})
export class ProductFormComponent {
  productForm!: FormGroup;
  isEditable: boolean = false;
  @Input() productId: number | null = null;
  constructor(
    private fb: FormBuilder,
    private productService: ProductService,
    private route: ActivatedRoute
  ) {
    this.productForm = this.fb.group({
      title: ['', Validators.required],
      price: ['', [Validators.required, Validators.min(0)]],
      description: ['', Validators.required],
    });
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['productId'] && this.productId !== null) {
      this.isEditable = true;
      this.productService
        .getProductById(this.productId)
        .subscribe((product) => {
          if (product) {
            this.productForm.patchValue({
              title: product.title,
              price: product.price,
              description: product.description,
            });
          }
        });
    }
  }

  onSubmit(): void {
    if (this.productForm.valid) {
      const productData = this.productForm.value;
      if (this.isEditable && this.productId !== null) {
        this.productService
          .updateProduct(this.productId, productData)
          .subscribe({
            next: () => {
              alert('Product updated successfully!');
              this.resetForm();
            },
            error: (err) => {
              console.error('Error updating product:', err);
            },
          });
      } else {
        this.productService.createproduct(productData).subscribe({
          next: () => {
            alert('Product created successfully!');
            this.resetForm();
          },
          error: (err) => {
            console.error('Error creating product:', err);
          },
        });
      }
    } else {
      alert('Please fill in all required fields.');
    }
  }
  resetForm(): void {
    this.productForm.reset();
    this.isEditable = false;
    this.productId = null;
  }
}
