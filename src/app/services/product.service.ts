import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Product } from '../interfaces/product.interface';

@Injectable({
  providedIn: 'root',
})
export class ProductService {
  private baseUrl = 'https://fakestoreapi.com/products';

  constructor(private http: HttpClient) {}
  getProducts(): Observable<Product> {
    return this.http.get<Product>(this.baseUrl);
  }
  getProductById(id: number): Observable<Product> {
    return this.http.get<Product>(`${this.baseUrl}/${id}`);
  }
  createproduct(product: any) {
    return this.http.post(this.baseUrl, product);
  }
  updateProduct(id: number, product: any): Observable<Product> {
    return this.http.put<Product>(`${this.baseUrl}/${id}`, product);
  }
  deleteProduct(id: number): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/${id}`);
  }
}
