# RMG Frontend Task

A modern **Angular Single Page Application (SPA)** built as a technical assignment to demonstrate **frontend architecture, clean code, and real-world business logic** — **without a real backend**.

The application simulates a complete workflow for:
- Product Management
- Invoice Creation & Management
- Dashboard Analytics

All data interactions are handled using a **Fake REST API (json-server)**.

---

## 🚀 Live Features

### 🔐 Authentication
- Login using fake API
- Route protection using Auth Guard
- Authenticated shell layout

---

### 🛒 Products Module
- Create / Read / Update / Delete products
- Strong validation:
  - Name & description must contain readable text
  - Prevent numbers-only or symbols-only values
- Clean UX:
  - Loading state
  - Empty state
  - Error handling
- Built with **Angular Signals**
- **OnPush Change Detection** for performance

---

### 🧾 Invoices Module

#### ➕ Create Invoice
- Select products dynamically
- Adjust quantities
- Automatic calculation:
  - Subtotal
  - Tax (14%)
  - Grand Total
- Validation:
  - Customer name required
  - At least one product required

#### 📄 Invoices List
- View all invoices
- Delete invoice
- Loading / Empty / Error states
- Ready for invoice details view

---

#### 📄 Invoice Details View

The Invoice Details page provides a complete, read-only view of a single invoice in a clean, professional layout similar to real accounting systems.

What this page displays:

Navigation

Back button to return to the invoices list

Improves user flow and usability

Invoice Header

Company / brand name

Invoice creation date and time

Clearly highlighted Grand Total

Invoice Items Table

List of all products included in the invoice

Columns:

Item name

Quantity

Unit price

Line total

Values are calculated dynamically based on stored invoice data

Financial Summary

Subtotal (sum of all item totals)

Tax (14%)

Grand Total (Subtotal + Tax)


### 📊 Dashboard
- Real statistics connected to fake API:
  - Total Products
  - Total Products Value
  - Invoices overview
- Professional charts using **Chart.js**
- Direct navigation to Products & Invoices modules

---

## 🛠️ Tech Stack

- **Angular** (Standalone Components)
- **Angular Signals**
- **TypeScript**
- **Tailwind CSS**
- **Chart.js**
- **RxJS**
- **json-server (Fake API)**
- **Angular Router + Guards**

---

## ▶️ Getting Started (How to Run the Project)

This project uses a **Fake REST API** instead of a real backend.  
⚠️ **Both the Angular app and the fake API must be running**.

---

### 1️⃣ Clone the repository
```bash
git clone <repository-url>
cd RMG-Frontend-Task


### 2️⃣ Install dependencies
```bash
npm install
```

### 3️⃣ Start the Fake API (json-server)
```bash
npx json-server --watch db.json --port 3000
Fake API will be available at:
http://localhost:3000
```

### 4️⃣ Start the Angular application
```bash
ng serve
```

### 5️⃣ Open the app
```bash
http://localhost:4200
```
