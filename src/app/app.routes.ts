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
            import('./features/home/home/home')
    },
    //   {
    //     path: 'products',
    //     canActivate: [authGuard],
    //     loadChildren: () =>
    //       import('./features/products/products.routes')
    //   },
    //   {
    //     path: 'invoices',
    //     canActivate: [authGuard],
    //     loadChildren: () =>
    //       import('./features/invoices/invoices.routes')
    //   },
    { path: '**', redirectTo: '' }

];
