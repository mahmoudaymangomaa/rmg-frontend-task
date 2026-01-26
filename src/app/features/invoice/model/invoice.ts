export interface InvoiceItem {
    productId: string;
    name: string;
    price: number;
    quantity: number;
    total: number;
}

export interface Invoice {
    id?: string;
    customerName: string;
    date: string;
    items: InvoiceItem[];
    subtotal: number;
    tax: number;
    grandTotal: number;
}
