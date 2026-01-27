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
import { ToastrService } from 'ngx-toastr';


@Component({
  standalone: true,
  selector: 'app-invoice-list',
  imports: [CommonModule, RouterModule],
  templateUrl: './invoice-list.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export default class InvoiceListComponent {
  private readonly api = inject(InvoicesService);
  private readonly toastr = inject(ToastrService);


  invoices = signal<Invoice[]>([]);
  loading = signal(false);
  error = signal<string | null>(null);

  confirmOpen = signal(false);
  invoiceToDelete = signal<string | null>(null);


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

  openDeleteConfirm(id: string): void {
    this.invoiceToDelete.set(id);
    this.confirmOpen.set(true);
  }

  cancelDelete(): void {
    this.confirmOpen.set(false);
    this.invoiceToDelete.set(null);
  }

  confirmDelete(): void {
    const id = this.invoiceToDelete();
    if (!id) return;

    this.api.delete(id).subscribe(() => {
      this.toastr.success('Invoice deleted successfully');
      this.confirmOpen.set(false);
      this.invoiceToDelete.set(null);
      this.load();
    });
  }

}
