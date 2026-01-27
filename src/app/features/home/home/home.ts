import {
  Component,
  ChangeDetectionStrategy,
  inject,
  signal,
  AfterViewInit,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { ProductsService } from '../../products/services/products';
import { Chart, registerables } from 'chart.js';
import { InvoicesService } from '../../invoice/services/invoice';

Chart.register(...registerables);

@Component({
  standalone: true,
  selector: 'app-home',
  imports: [CommonModule, RouterModule],
  templateUrl: './home.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export default class HomeComponent implements AfterViewInit {
  private readonly productsApi = inject(ProductsService);
  private readonly invoicesApi = inject(InvoicesService);

  productsCount = signal(0);
  productsTotal = signal(0);

  invoicesCount = signal(0);
  invoicesTotal = signal(0);

  private productsChart?: Chart;
  private invoicesChart?: Chart;

  ngAfterViewInit(): void {
    this.loadProductsStats();
    this.loadInvoicesStats();
  }

  private loadProductsStats(): void {
    this.productsApi.getAll().subscribe(products => {
      this.productsCount.set(products.length);
      this.productsTotal.set(products.reduce((s, p) => s + p.price, 0));

      this.renderProductsChart();
      this.renderInvoicesChart();
    });
  }

  private loadInvoicesStats(): void {
    this.invoicesApi.getAll().subscribe(invoices => {
      this.invoicesCount.set(invoices.length);
      this.invoicesTotal.set(
        invoices.reduce((s, i) => s + i.grandTotal, 0)
      );

      this.renderInvoicesChart();
    });
  }


  // =====================
  // PRODUCTS CHART
  // =====================
  private renderProductsChart(): void {
    this.productsChart?.destroy();

    this.productsChart = new Chart('productsChart', {
      type: 'doughnut',
      data: {
        labels: ['Products'],
        datasets: [
          {
            data: [this.productsCount()],
            backgroundColor: ['#3b82f6'],
            hoverBackgroundColor: ['#2563eb'],
            borderWidth: 0,
          },
        ],
      },
      options: {
        cutout: '70%',
        responsive: true,
        plugins: {
          legend: { display: false },
          tooltip: {
            callbacks: {
              label: () =>
                `${this.productsCount()} Products`,
            },
          },
        },
      },
      plugins: [
        {
          id: 'centerText',
          afterDraw: chart => {
            const { ctx } = chart;
            ctx.save();
            ctx.font = 'bold 18px sans-serif';
            ctx.fillStyle = '#111827';
            ctx.textAlign = 'center';
            ctx.textBaseline = 'middle';
            ctx.fillText(
              String(this.productsCount()),
              chart.width / 2,
              chart.height / 2
            );
          },
        },
      ],
    });
  }

  // =====================
  // INVOICES CHART (Mock)
  // =====================
  private renderInvoicesChart(): void {
    this.invoicesChart?.destroy();

    this.invoicesChart = new Chart('invoicesChart', {
      type: 'doughnut',
      data: {
        labels: ['Invoices'],
        datasets: [
          {
            data: [this.invoicesCount()],
            backgroundColor: ['#10b981'],
            hoverBackgroundColor: ['#059669'],
            borderWidth: 0,
          },
        ],
      },
      options: {
        cutout: '70%',
        responsive: true,
        plugins: {
          legend: { display: false },
          tooltip: {
            callbacks: {
              label: () =>
                `${this.invoicesCount()} Invoices`,
            },
          },
        },
      },
      plugins: [
        {
          id: 'centerText',
          afterDraw: chart => {
            const { ctx } = chart;
            ctx.save();
            ctx.font = 'bold 18px sans-serif';
            ctx.fillStyle = '#111827';
            ctx.textAlign = 'center';
            ctx.textBaseline = 'middle';
            ctx.fillText(
              String(this.invoicesCount()),
              chart.width / 2,
              chart.height / 2
            );
          },
        },
      ],
    });
  }

}
