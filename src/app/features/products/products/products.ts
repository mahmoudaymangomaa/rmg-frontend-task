import {
  Component,
  ChangeDetectionStrategy,
  inject,
  signal,
} from '@angular/core';
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

  // ============================
  // STATE
  // ============================
  products = signal<Product[]>([]);

  name = signal('');
  price = signal<number | null>(null);
  description = signal('');

  editingId = signal<number | null>(null);

  // ============================
  // LIFECYCLE
  // ============================
  ngOnInit(): void {
    this.load();
  }

  // ============================
  // DATA
  // ============================
  load(): void {
    this.api.getAll().subscribe(p => this.products.set(p));
  }

  // ============================
  // CREATE / UPDATE
  // ============================
  save(): void {
    if (!this.name() || !this.price()) return;

    const payload: Product = {
      name: this.name(),
      price: this.price()!,
      description: this.description(),
    };

    const request$ = this.editingId()
      ? this.api.update(this.editingId()!, payload)
      : this.api.create(payload);

    request$.subscribe(() => {
      this.resetForm();
      this.load();
    });
  }

  edit(product: Product): void {
    this.editingId.set(product.id!);
    this.name.set(product.name);
    this.price.set(product.price);
    this.description.set(product.description ?? '');
  }

  remove(id: number): void {
    this.api.delete(id).subscribe(() => this.load());
  }

  // ============================
  // HELPERS
  // ============================
  resetForm(): void {
    this.name.set('');
    this.price.set(null);
    this.description.set('');
    this.editingId.set(null);
  }
}
