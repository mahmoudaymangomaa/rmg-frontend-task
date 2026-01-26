import {
  Component,
  ChangeDetectionStrategy,
  inject,
  signal,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { ProductsService } from '../../../products/services/products';
import { InvoicesService } from '../../services/invoice';
import { Product } from '../../../products/model/product';
import { Invoice, InvoiceItem } from '../../model/invoice';

@Component({
  standalone: true,
  selector: 'app-invoice',
  imports: [CommonModule],
  templateUrl: './invoice.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export default class InvoicesComponent {
  private readonly productsApi = inject(ProductsService);
  private readonly invoicesApi = inject(InvoicesService);

  products = signal<Product[]>([]);
  items = signal<InvoiceItem[]>([]);
  customerName = signal('');
  error = signal<string | null>(null);

  taxRate = 0.14;

  ngOnInit(): void {
    this.productsApi.getAll().subscribe(p => this.products.set(p));
  }

  // =====================
  // ADD PRODUCT
  // =====================
  addProduct(product: Product): void {
    if (!product.id) return;

    const existing = this.items().find(
      i => i.productId === product.id
    );

    if (existing) {
      existing.quantity++;
      existing.total = existing.quantity * existing.price;
      this.items.set([...this.items()]);
      return;
    }

    this.items.set([
      ...this.items(),
      {
        productId: product.id,
        name: product.name,
        price: product.price,
        quantity: 1,
        total: product.price,
      },
    ]);
  }

  // =====================
  // UPDATE QTY
  // =====================
  updateQty(item: InvoiceItem, qty: number): void {
    if (qty < 1) return;

    item.quantity = qty;
    item.total = qty * item.price;
    this.items.set([...this.items()]);
  }

  // =====================
  // REMOVE ITEM
  // =====================
  removeItem(productId: string): void {
    this.items.set(
      this.items().filter(i => i.productId !== productId)
    );
  }

  // =====================
  // TOTALS
  // =====================
  get subtotal(): number {
    return this.items().reduce((s, i) => s + i.total, 0);
  }

  get tax(): number {
    return this.subtotal * this.taxRate;
  }

  get grandTotal(): number {
    return this.subtotal + this.tax;
  }

  // =====================
  // SAVE
  // =====================
  saveInvoice(): void {
    if (!this.customerName()) {
      this.error.set('Customer name is required');
      return;
    }

    if (this.items().length === 0) {
      this.error.set('Please add at least one product');
      return;
    }

    const invoice: Invoice = {
      customerName: this.customerName(),
      date: new Date().toISOString(),
      items: this.items(),
      subtotal: this.subtotal,
      tax: this.tax,
      grandTotal: this.grandTotal,
    };

    this.invoicesApi.create(invoice).subscribe(() => {
      this.customerName.set('');
      this.items.set([]);
      this.error.set(null);
      alert('Invoice created successfully');
    });
  }
}
