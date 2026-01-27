import { Routes } from '@angular/router';
import { authGuard } from './core/guards/auth-guard';

export const routes: Routes = [
    {
        path: 'login',
        loadComponent: () =>
            import('./features/auth/login/login')
    },
    {
        path: '',
        canActivate: [authGuard],
        loadComponent: () =>
            import('./features/shell/layout/layout'),
        children: [
            {
                path: '',
                loadComponent: () =>
                    import('./features/home/home/home')
            },
            {
                path: 'products',
                loadComponent: () =>
                    import('./features/products/component/products')
            },
            {
                path: 'invoice',
                loadComponent: () =>
                    import('./features/invoice/component/invoice/invoice')
            },
            {
                path: 'invoices',
                loadComponent: () =>
                    import('./features/invoice/component/invoice-list/invoice-list/invoice-list')
            },
            {
                path: 'invoices/:id',
                loadComponent: () =>
                    import('./features/invoice/component/invoice-details/invoice-details/invoice-details')
            }
        ]
    },
    { path: '**', redirectTo: '' }

];
