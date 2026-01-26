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

  // =====================
  // STATE
  // =====================
  products = signal<Product[]>([]);
  loading = signal(false);
  error = signal<string | null>(null);

  // =====================
  // FORM
  // =====================
  editingId = signal<number | null>(null);
  name = signal('');
  price = signal<number | null>(null);
  description = signal('');

  // =====================
  // VALIDATION
  // =====================
  private readonly TEXT_REGEX =
    /^(?=.*[a-zA-Z\u0600-\u06FF]).+$/;

  isNameValid = () =>
    this.TEXT_REGEX.test(this.name());

  isDescriptionValid = () =>
    !this.description() ||
    this.TEXT_REGEX.test(this.description());

  isFormValid = () =>
    !!this.name() &&
    !!this.price() &&
    this.isNameValid() &&
    this.isDescriptionValid();

  // =====================
  // LIFECYCLE
  // =====================
  ngOnInit(): void {
    this.load();
  }

  // =====================
  // LOAD
  // =====================
  load(): void {
    this.loading.set(true);
    this.error.set(null);

    this.api.getAll().subscribe({
      next: data => this.products.set(data),
      error: () => this.error.set('Failed to load products'),
      complete: () => this.loading.set(false),
    });
  }

  // =====================
  // SAVE (ADD / EDIT)
  // =====================
  save(): void {
    if (!this.isFormValid()) {
      this.error.set(
        'Please enter a valid product name and description'
      );
      return;
    }

    this.loading.set(true);
    this.error.set(null);

    const payload: Product = {
      name: this.name().trim(),
      price: this.price()!,
      description: this.description().trim(),
    };

    const request$ = this.editingId()
      ? this.api.update(this.editingId()!, payload)
      : this.api.create(payload);

    request$.subscribe({
      next: () => {
        this.resetForm();
        this.load();
      },
      error: () => this.error.set('Failed to save product'),
      complete: () => this.loading.set(false),
    });
  }

  // =====================
  // EDIT
  // =====================
  edit(product: Product): void {
    this.editingId.set(product.id!);
    this.name.set(product.name);
    this.price.set(product.price);
    this.description.set(product.description || '');
    this.error.set(null);
  }

  // =====================
  // DELETE
  // =====================
  remove(id: number): void {
    if (!confirm('Delete this product?')) return;

    this.loading.set(true);

    this.api.delete(id).subscribe({
      next: () => this.load(),
      error: () => this.error.set('Failed to delete product'),
      complete: () => this.loading.set(false),
    });
  }

  // =====================
  // RESET
  // =====================
  resetForm(): void {
    this.editingId.set(null);
    this.name.set('');
    this.price.set(null);
    this.description.set('');
    this.error.set(null);
  }
}
