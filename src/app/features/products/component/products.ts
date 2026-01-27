import {
  Component,
  ChangeDetectionStrategy,
  inject,
  signal,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { Product } from '../model/product';
import { ProductsService } from '../services/products';
import { ToastrService } from 'ngx-toastr';

@Component({
  standalone: true,
  selector: 'app-products',
  imports: [CommonModule],
  templateUrl: './products.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export default class ProductsComponent {
  private readonly api = inject(ProductsService);
  private readonly toastr = inject(ToastrService);

  // =====================
  // STATE
  // =====================
  products = signal<Product[]>([]);
  loading = signal(false);
  error = signal<string | null>(null);

  // =====================
  // FORM
  // =====================
  editingId = signal<string | null>(null); // ✅ string
  name = signal('');
  price = signal<number | null>(null);
  description = signal('');

  // Confirmation popup state
  confirmOpen = signal(false);
  confirmId = signal<string | null>(null);
  confirmAction = signal<'delete' | null>(null);

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
      ? this.api.update(this.editingId()!, payload) // ✅ string
      : this.api.create(payload);

    request$.subscribe({
      next: () => {
        const isEdit = !!this.editingId();

        this.resetForm();
        this.load();

        this.toastr.success(
          isEdit ? 'Product updated successfully' : 'Product added successfully',
          'Success'
        );
      },
      error: () => {
        this.toastr.error('Failed to save product', 'Error');
        this.loading.set(false);
      },
      complete: () => this.loading.set(false),
    });

  }

  // =====================
  // EDIT
  // =====================
  edit(product: Product): void {
    if (!product.id) return;

    this.editingId.set(product.id); // ✅ string
    this.name.set(product.name);
    this.price.set(product.price);
    this.description.set(product.description || '');
    this.error.set(null);
  }

  // =====================
  // DELETE
  // =====================
  openDeleteConfirm(id: string): void {
    this.confirmId.set(id);
    this.confirmAction.set('delete');
    this.confirmOpen.set(true);
  }

  confirmDelete(): void {
    const id = this.confirmId();
    if (!id) return;

    this.loading.set(true);
    this.confirmOpen.set(false);

    this.api.delete(id).subscribe({
      next: () => {
        this.load();
        this.toastr.success('Product deleted successfully', 'Deleted');
      },
      error: () => {
        this.toastr.error('Failed to delete product', 'Error');
        this.loading.set(false);
      },
    });
  }

  closeConfirm(): void {
    this.confirmOpen.set(false);
    this.confirmId.set(null);
    this.confirmAction.set(null);
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
