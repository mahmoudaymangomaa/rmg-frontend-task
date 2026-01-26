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

  productsCount = signal(0);
  productsTotal = signal(0);

  private productsChart?: Chart;
  private invoicesChart?: Chart;

  ngAfterViewInit(): void {
    this.loadProductsStats();
  }

  private loadProductsStats(): void {
    this.productsApi.getAll().subscribe(products => {
      this.productsCount.set(products.length);
      this.productsTotal.set(products.reduce((s, p) => s + p.price, 0));

      this.renderProductsChart();
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
      type: 'bar',
      data: {
        labels: ['Invoices'],
        datasets: [
          {
            data: [0],
            backgroundColor: '#d1d5db',
            borderRadius: 8,
          },
        ],
      },
      options: {
        responsive: true,
        plugins: {
          legend: { display: false },
          tooltip: {
            callbacks: {
              label: () => 'No invoices yet',
            },
          },
        },
        scales: {
          x: { display: false },
          y: {
            display: false,
            beginAtZero: true,
          },
        },
      },
    });
  }
}
