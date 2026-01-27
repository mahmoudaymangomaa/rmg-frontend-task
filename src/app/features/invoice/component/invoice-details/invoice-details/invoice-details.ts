import {
  Component,
  ChangeDetectionStrategy,
  inject,
  signal,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { InvoicesService } from '../../../services/invoice';
import { Invoice } from '../../../model/invoice';


@Component({
  standalone: true,
  selector: 'app-invoice-details',
  imports: [CommonModule, RouterModule],
  templateUrl: './invoice-details.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export default class InvoiceDetailsComponent {
  private readonly route = inject(ActivatedRoute);
  private readonly api = inject(InvoicesService);

  invoice = signal<Invoice | null>(null);
  loading = signal(false);
  error = signal<string | null>(null);

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');

    if (!id) {
      this.error.set('Invalid invoice id');
      return;
    }

    this.loadInvoice(id);
  }

  private loadInvoice(id: string): void {
    this.loading.set(true);
    this.error.set(null);

    this.api.getById(id).subscribe({
      next: data => this.invoice.set(data),
      error: () => this.error.set('Invoice not found'),
      complete: () => this.loading.set(false),
    });
  }
}
