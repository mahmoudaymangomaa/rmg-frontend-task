import { Component, ChangeDetectionStrategy, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Product } from '../model/product';
import { ProductsService } from '../services/products';

@Component({
  standalone: true,
  selector: 'app-products',
  imports: [CommonModule],
  templateUrl: './products.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export default class ProductsComponent {
  private readonly api = inject(ProductsService);

  products = signal<Product[]>([]);
  name = signal('');
  price = signal<number | null>(null);

  ngOnInit(): void {
    this.load();
  }

  load(): void {
    this.api.getAll().subscribe(p => this.products.set(p));
  }

  add(): void {
    if (!this.name() || !this.price()) return;

    this.api.create({
      name: this.name(),
      price: this.price()!,
    }).subscribe(() => {
      this.name.set('');
      this.price.set(null);
      this.load();
    });
  }

  remove(id: number): void {
    this.api.delete(id).subscribe(() => this.load());
  }
}
