# RMG Frontend Task

A modern **Angular Single Page Application (SPA)** built as a technical assignment to demonstrate **frontend architecture, clean code, performance optimization, and real-world business logic** — **without a real backend**.

The application simulates a complete business workflow for:
- Product Management
- Invoice Creation & Management
- Dashboard Analytics
- PDF Export

> **Angular Material was intentionally not used** in favor of **Tailwind CSS** to allow faster UI iteration, full design control, and a modern visual system.

All data interactions are handled using a **Fake REST API (json-server)**.

---

## 🚀 Live Features

### 🔐 Authentication
- Login using fake API (json-server)
- Route protection using **Auth Guards**
- Authenticated shell layout (Header + Navigation)
- Clean logout flow

---

## 🛒 Products Module
- Full **CRUD** operations:
  - Create
  - Read
  - Update
  - Delete
- Strong validation rules:
  - Product name must contain readable text
  - Prevent numbers-only or symbols-only values
  - Optional description with readability validation
- Clean UX states:
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
- Manual quantity updates
- Automatic calculations:
  - Subtotal
  - Tax (14%)
  - Grand Total
- Validation rules:
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

The **Invoice Details** page provides a clean, professional, read-only view of a single invoice, inspired by real accounting systems.

#### Included Features:

**Navigation**
- Back button to return to invoices list
- Improved user flow and usability

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
- Values calculated dynamically based on stored invoice data

**Financial Summary**
- Subtotal
- Tax (14%)
- Grand Total

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
- Automatically downloaded PDF file

This approach reflects **real-world production practices** and avoids common frontend PDF pitfalls.

---

## 📊 Dashboard
- Real-time statistics connected to fake API:
  - Total products count
  - Total products value
  - Invoices overview
- Interactive charts using **Chart.js**
- Quick navigation to:
  - Products
  - Invoices

---

## ⚙️ Runtime Configuration
- Uses a runtime `config.json` file
- API base URL loaded at application startup using `APP_INITIALIZER`
- Managed via `AppConfigService`
- Allows changing API URLs without rebuilding the app
- Suitable for multi-environment deployment (local / staging / production)

---

## ⚡ Performance Optimizations
- Standalone Components to reduce bundle size
- Lazy-loaded feature routes
- **OnPush Change Detection Strategy**
- **Angular Signals** to minimize unnecessary re-renders
- Optimized change detection and rendering flow

---

## 📱 Responsive Design
- Fully responsive layout (Desktop, Tablet, Mobile)
- Tailwind CSS used for adaptive spacing, typography, and layout control
- Mobile-friendly navigation and tables

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


## 🚀 Getting Started (Local Development)

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