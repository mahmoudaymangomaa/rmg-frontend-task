import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map, Observable, of } from 'rxjs';
import { Invoice } from '../model/invoice';

@Injectable({ providedIn: 'root' })
export class InvoicesService {
  private readonly http = inject(HttpClient);
  private readonly STORAGE_KEY = 'rmg_invoices';

  private invoices: Invoice[] = [];
  private loaded = false;

  // =====================
  // LOAD
  // =====================
  getAll(): Observable<Invoice[]> {
    if (this.loaded) {
      return of(this.invoices);
    }

    const stored = localStorage.getItem(this.STORAGE_KEY);
    if (stored) {
      this.invoices = JSON.parse(stored);
      this.loaded = true;
      return of(this.invoices);
    }

    return this.http
      .get<{ invoices: Invoice[] }>('/users.json')
      .pipe(
        map(res => {
          this.invoices = res.invoices ?? [];
          this.persist();
          this.loaded = true;
          return this.invoices;
        })
      );
  }

  // =====================
  // CREATE
  // =====================
  create(invoice: Invoice): Observable<Invoice> {
    const newInvoice: Invoice = {
      ...invoice,
      id: crypto.randomUUID(),
    };

    this.invoices = [...this.invoices, newInvoice];
    this.persist();
    return of(newInvoice);
  }

  // =====================
  // DELETE
  // =====================
  delete(id: string): Observable<void> {
    this.invoices = this.invoices.filter(i => i.id !== id);
    this.persist();
    return of(void 0);
  }

  // =====================
  // GET BY ID
  // =====================
  getById(id: string): Observable<Invoice> {
    const invoice = this.invoices.find(i => i.id === id);
    if (!invoice) throw new Error('Invoice not found');
    return of(invoice);
  }

  // =====================
  // SAVE TO STORAGE
  // =====================
  private persist(): void {
    localStorage.setItem(
      this.STORAGE_KEY,
      JSON.stringify(this.invoices)
    );
  }
}
