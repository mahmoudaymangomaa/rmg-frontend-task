import {
  Component,
  ChangeDetectionStrategy,
  inject,
  signal,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { InvoicesService } from '../../../services/invoice';
import { Invoice } from '../../../model/invoice';


@Component({
  standalone: true,
  selector: 'app-invoice-list',
  imports: [CommonModule, RouterModule],
  templateUrl: './invoice-list.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export default class InvoiceListComponent {
  private readonly api = inject(InvoicesService);

  invoices = signal<Invoice[]>([]);
  loading = signal(false);
  error = signal<string | null>(null);

  ngOnInit(): void {
    this.load();
  }

  load(): void {
    this.loading.set(true);
    this.error.set(null);

    this.api.getAll().subscribe({
      next: data => this.invoices.set(data),
      error: () => this.error.set('Failed to load invoices'),
      complete: () => this.loading.set(false),
    });
  }

  delete(id: string): void {
    if (!confirm('Delete this invoice?')) return;

    this.api.delete(id).subscribe(() => this.load());
  }
}
