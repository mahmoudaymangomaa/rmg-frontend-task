import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Invoice } from '../model/invoice';

@Injectable({ providedIn: 'root' })
export class InvoicesService {
  private readonly http = inject(HttpClient);
  private readonly API_URL = 'http://localhost:3000/invoices';

  getAll(): Observable<Invoice[]> {
    return this.http.get<Invoice[]>(this.API_URL);
  }

  create(invoice: Invoice): Observable<Invoice> {
    return this.http.post<Invoice>(this.API_URL, invoice);
  }

  delete(id: string) {
    return this.http.delete(`${this.API_URL}/${id}`);
  }
}

