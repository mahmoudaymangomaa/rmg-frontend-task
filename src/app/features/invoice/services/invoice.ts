import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Invoice } from '../model/invoice';
import { AppConfigService } from '../../../core/config/app-config.service';

@Injectable({ providedIn: 'root' })
export class InvoicesService {
  private readonly http = inject(HttpClient);
  private readonly appConfig = inject(AppConfigService);

  getAll(): Observable<Invoice[]> {
    return this.http.get<Invoice[]>(this.appConfig.baseURL + 'invoices');
  }

  create(invoice: Invoice): Observable<Invoice> {
    return this.http.post<Invoice>(this.appConfig.baseURL + 'invoices', invoice);
  }

  delete(id: string) {
    return this.http.delete(`${this.appConfig.baseURL + 'invoices'}/${id}`);
  }

  getById(id: string): Observable<Invoice> {
    return this.http.get<Invoice>(`${this.appConfig.baseURL + 'invoices'}/${id}`);
  }

}

