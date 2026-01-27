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

import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';

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

  // =====================
  // PDF EXPORT
  // =====================
  exportPDF(): void {
    if (!this.invoice()) return;

    const invoice = this.invoice()!;
    const pdf = new jsPDF('p', 'mm', 'a4');

    let y = 20;

    // ===== HEADER =====
    pdf.setFontSize(18);
    pdf.text('Invoice', 105, y, { align: 'center' });
    y += 10;

    pdf.setFontSize(11);
    pdf.text(`Customer: ${invoice.customerName}`, 20, y);
    y += 6;
    pdf.text(`Date: ${new Date(invoice.date).toLocaleString()}`, 20, y);
    y += 10;

    // ===== TABLE HEADER =====
    pdf.setFontSize(12);
    pdf.text('Item', 20, y);
    pdf.text('Qty', 100, y);
    pdf.text('Price', 120, y);
    pdf.text('Total', 160, y);
    y += 4;

    pdf.line(20, y, 190, y);
    y += 6;

    // ===== ITEMS =====
    pdf.setFontSize(11);
    invoice.items.forEach(item => {
      pdf.text(item.name, 20, y);
      pdf.text(String(item.quantity), 100, y);
      pdf.text(`${item.price} EGP`, 120, y);
      pdf.text(`${item.total} EGP`, 160, y);
      y += 6;

      if (y > 260) {
        pdf.addPage();
        y = 20;
      }
    });

    y += 6;
    pdf.line(20, y, 190, y);
    y += 8;

    // ===== SUMMARY =====
    pdf.setFontSize(12);
    pdf.text(`Subtotal: ${invoice.subtotal} EGP`, 140, y);
    y += 6;
    pdf.text(`Tax: ${invoice.tax} EGP`, 140, y);
    y += 6;

    pdf.setFontSize(14);
    pdf.text(`Grand Total: ${invoice.grandTotal} EGP`, 140, y);

    // ===== SAVE =====
    pdf.save(`Invoice-${invoice.id || 'RMG'}.pdf`);
  }


}
