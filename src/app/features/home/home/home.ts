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
  // PRODUCTS CHART - Line Chart with Trend
  // =====================
  private renderProductsChart(): void {
    this.productsChart?.destroy();

    // Generate mock monthly data for demonstration
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'];
    const productsData = [12, 19, 15, 25, 22, this.productsCount()];

    this.productsChart = new Chart('productsChart', {
      type: 'line',
      data: {
        labels: months,
        datasets: [
          {
            label: 'Products',
            data: productsData,
            borderColor: '#3b82f6',
            backgroundColor: 'rgba(59, 130, 246, 0.1)',
            borderWidth: 3,
            fill: true,
            tension: 0.4,
            pointBackgroundColor: '#3b82f6',
            pointBorderColor: '#fff',
            pointBorderWidth: 2,
            pointRadius: 5,
            pointHoverRadius: 7,
          },
        ],
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: { display: false },
          tooltip: {
            backgroundColor: 'rgba(0, 0, 0, 0.8)',
            padding: 12,
            titleColor: '#fff',
            bodyColor: '#fff',
            borderColor: '#3b82f6',
            borderWidth: 1,
            displayColors: false,
          },
        },
        scales: {
          y: {
            beginAtZero: true,
            grid: {
              color: 'rgba(0, 0, 0, 0.05)',
            },
            ticks: {
              color: '#64748b',
            },
          },
          x: {
            grid: {
              display: false,
            },
            ticks: {
              color: '#64748b',
            },
          },
        },
      },
    });
  }

  // =====================
  // INVOICES CHART - Bar Chart
  // =====================
  private renderInvoicesChart(): void {
    this.invoicesChart?.destroy();

    // Generate mock monthly data for demonstration
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'];
    const invoicesData = [5, 8, 6, 12, 9, this.invoicesCount()];

    this.invoicesChart = new Chart('invoicesChart', {
      type: 'bar',
      data: {
        labels: months,
        datasets: [
          {
            label: 'Invoices',
            data: invoicesData,
            backgroundColor: 'rgba(16, 185, 129, 0.8)',
            borderColor: '#10b981',
            borderWidth: 2,
            borderRadius: 8,
            hoverBackgroundColor: '#10b981',
          },
        ],
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: { display: false },
          tooltip: {
            backgroundColor: 'rgba(0, 0, 0, 0.8)',
            padding: 12,
            titleColor: '#fff',
            bodyColor: '#fff',
            borderColor: '#10b981',
            borderWidth: 1,
            displayColors: false,
          },
        },
        scales: {
          y: {
            beginAtZero: true,
            grid: {
              color: 'rgba(0, 0, 0, 0.05)',
            },
            ticks: {
              color: '#64748b',
            },
          },
          x: {
            grid: {
              display: false,
            },
            ticks: {
              color: '#64748b',
            },
          },
        },
      },
    });
  }

}