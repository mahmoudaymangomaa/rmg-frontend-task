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
  taxRate = 0.14;

  ngOnInit(): void {
    this.productsApi.getAll().subscribe(p => this.products.set(p));
  }

  addProduct(product: Product): void {
    const existing = this.items().find(i => i.productId === product.id);

    if (existing) {
      existing.quantity++;
      existing.total = existing.quantity * existing.price;
      this.items.set([...this.items()]);
      return;
    }

    this.items.set([
      ...this.items(),
      {
        productId: product.id!,
        name: product.name,
        price: product.price,
        quantity: 1,
        total: product.price,
      },
    ]);
  }

  updateQty(item: InvoiceItem, qty: number): void {
    item.quantity = qty;
    item.total = qty * item.price;
    this.items.set([...this.items()]);
  }

  removeItem(productId: number): void {
    this.items.set(this.items().filter(i => i.productId !== productId));
  }

  get subtotal(): number {
    return this.items().reduce((s, i) => s + i.total, 0);
  }

  get tax(): number {
    return this.subtotal * this.taxRate;
  }

  get grandTotal(): number {
    return this.subtotal + this.tax;
  }

  saveInvoice(): void {
    if (!this.customerName() || this.items().length === 0) return;

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
      alert('Invoice created successfully');
    });
  }
}
