import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map, Observable, of } from 'rxjs';
import { Product } from '../model/product';

@Injectable({ providedIn: 'root' })
export class ProductsService {
  private readonly http = inject(HttpClient);
  private readonly STORAGE_KEY = 'rmg_products';

  private products: Product[] = [];
  private loaded = false;

  getAll(): Observable<Product[]> {
    if (this.loaded) {
      return of(this.products);
    }

    const stored = localStorage.getItem(this.STORAGE_KEY);
    if (stored) {
      this.products = JSON.parse(stored);
      this.loaded = true;
      return of(this.products);
    }

    return this.http
      .get<{ products: Product[] }>('/users.json')
      .pipe(
        map(res => {
          this.products = res.products ?? [];
          this.persist();
          this.loaded = true;
          return this.products;
        })
      );
  }

  create(product: Product): Observable<Product> {
    const newProduct: Product = {
      ...product,
      id: crypto.randomUUID(),
    };

    this.products = [...this.products, newProduct];
    this.persist();
    return of(newProduct);
  }

  update(id: string, product: Product): Observable<Product> {
    this.products = this.products.map(p =>
      p.id === id ? { ...product, id } : p
    );
    this.persist();
    return of(product);
  }

  delete(id: string): Observable<void> {
    this.products = this.products.filter(p => p.id !== id);
    this.persist();
    return of(void 0);
  }

  private persist(): void {
    localStorage.setItem(
      this.STORAGE_KEY,
      JSON.stringify(this.products)
    );
  }
}
