# RMG Frontend Task

A modern **Angular Single Page Application (SPA)** built as a technical assignment to demonstrate **frontend architecture, clean code, and real-world business logic** — **without a real backend**.

The application simulates a complete workflow for:
- Product Management
- Invoice Creation & Management
- Dashboard Analytics
- PDF Export
- Angular Material was intentionally not used in favor of Tailwind CSS for faster UI iteration and full control over styling.
All data interactions are handled using a **Fake REST API (json-server)**.

---

## 🚀 Live Features

### 🔐 Authentication
- Login using fake API (json-server)
- Route protection using **Auth Guard**
- Authenticated shell layout (Sidebar + Header)
- Clean logout flow

---

## 🛒 Products Module
- Full **CRUD** operations:
  - Create
  - Read
  - Update
  - Delete
- Strong validation:
  - Product name must contain readable text
  - Prevent numbers-only or symbols-only values
  - Description validation (optional but readable)
- Clean UX:
  - Loading state
  - Empty state
  - Error handling
- Built using:
  - **Angular Signals**
  - **OnPush Change Detection** for performance
- Fully compliant with Fake API (json-server)

---

## 🧾 Invoices Module

### ➕ Create Invoice
- Select products dynamically
- Add the same product multiple times (quantity auto-increment)
- Update quantities manually
- Automatic calculations:
  - Subtotal
  - Tax (14%)
  - Grand Total
- Validation:
  - Customer name is required
  - At least one product is required before saving
- Invoice data persisted to fake API

---

### 📄 Invoices List
- Fetch invoices from fake API
- Display:
  - Customer name
  - Invoice date
  - Items count
  - Grand total
- Delete invoice
- Clean UX:
  - Loading state
  - Empty state
  - Error handling
- Navigation to Invoice Details page

---

### 📄 Invoice Details View

The **Invoice Details** page provides a complete, read-only view of a single invoice in a clean and professional layout similar to real accounting systems.

#### What this page includes:

**Navigation**
- Back button to return to invoices list
- Improves user flow and usability

**Invoice Header**
- Customer name
- Invoice creation date & time
- Clearly highlighted **Grand Total**

**Invoice Items Table**
- List of all products included in the invoice
- Columns:
  - Item name
  - Quantity
  - Unit price
  - Line total
- Values are calculated dynamically based on stored invoice data

**Financial Summary**
- Subtotal (sum of all item totals)
- Tax (14%)
- Grand Total (Subtotal + Tax)

---

## 📄 PDF Export (Implemented)

The application supports **exporting invoice details as a PDF file**.

### 🧠 Technical Decision
Initially, `html2canvas` was evaluated, but it failed due to:
- Incompatibility with modern CSS color functions such as `oklch` used by Tailwind CSS
- Performance and rendering issues with computed styles

### ✅ Final Solution
- Implemented **text-based PDF generation using jsPDF**
- No DOM snapshotting
- No CSS parsing
- Full control over layout and performance
- Stable and production-ready approach

### 📌 PDF Export Features
- Invoice header (customer name & date)
- Items table
- Subtotal, tax, and grand total
- Automatically downloaded as:


This approach reflects **real-world production practices** and avoids common pitfalls.

---

## 📊 Dashboard
- Real-time statistics connected to fake API:
- Total Products count
- Total Products value
- Invoices overview
- Interactive and clean charts using **Chart.js**
- Quick navigation to:
- Products
- Invoices

---

## 🛠️ Tech Stack

- **Angular** (Standalone Components)
- **Angular Signals**
- **TypeScript**
- **Tailwind CSS**
- **Chart.js**
- **RxJS**
- **json-server (Fake REST API)**
- **Angular Router + Guards**
- **jsPDF**

---

## 🧭 Routing Overview

```txt
/
├── login
├── /
│   ├── dashboard
│   ├── products
│   ├── invoice        (create)
│   ├── invoices       (list)
│   └── invoices/:id   (details)

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