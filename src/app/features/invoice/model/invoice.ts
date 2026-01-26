export interface InvoiceItem {
    productId: number;
    name: string;
    price: number;
    quantity: number;
    total: number;
}

export interface Invoice {
    id?: number;
    customerName: string;
    date: string;
    items: InvoiceItem[];
    subtotal: number;
    tax: number;
    grandTotal: number;
}
