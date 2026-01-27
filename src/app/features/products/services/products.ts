import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Product } from '../model/product';
import { AppConfigService } from '../../../core/config/app-config.service';

@Injectable({ providedIn: 'root' })
export class ProductsService {
  private readonly http = inject(HttpClient);
  // private readonly API_URL = 'http://localhost:3000/products';
  private readonly appConfig = inject(AppConfigService);

  getAll(): Observable<Product[]> {
    return this.http.get<Product[]>(this.appConfig.baseURL + 'products');
  }

  create(product: Product): Observable<Product> {
    return this.http.post<Product>(this.appConfig.baseURL + 'products', product);
  }

  update(id: string, product: Product): Observable<Product> {
    return this.http.put<Product>(`${this.appConfig.baseURL + 'products'}/${id}`, product);
  }

  delete(id: string): Observable<void> {
    return this.http.delete<void>(`${this.appConfig.baseURL + 'products'}/${id}`);
  }
}
