# DischargeFlow AI — Hospital Administration & Discharge Management SaaS

A modern, role-based healthcare operations and discharge continuity platform designed for rapid inpatient throughput, administrative oversight, and multi-department coordination.

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/akagamiyokex-sudo/Dischhargeflow_AI)

---

## 🏥 Role-Based Hospital Workspaces

DischargeFlow AI implements strict role-based access control (RBAC) across distinct hospital desks:

1. **Front Desk Staff**:
   - Master Patient Index (MPI) registration with auto-generated MRN IDs
   - Outpatient appointment scheduling & check-in management
   - Inpatient admission intake & ward/bed allocations
   - Global fast patient search (Name, MRN, Phone Number)
   - *Protected Clinical Boundary*: Administrative & demographic updates only

2. **Hospital Administrator**:
   - System overview, 5-hour target discharge monitor, and length-of-stay metrics
   - Staff credentials directory (create, edit, deactivate, and reset user access)
   - Department, clinic, and bed capacity operations
   - HIPAA compliance audit logs tracking all user and front desk activity

3. **Clinical & Departmental Desks**:
   - **Doctor / Consultant**: Clinical progress notes, CPOE orders, and AI discharge summary review
   - **Nurse / Ward Staff**: Bedside vitals, care checklists, and release readiness
   - **Discharge Operator / HIM**: Multi-department 6-stage discharge coordination
   - **Billing Counter**: Inpatient itemized ledgers, insurance pre-auth, and financial release tokens
   - **Pharmacy & Laboratory**: E-prescription dispensing and STAT diagnostic accessioning
   - **Patient & Family Portal**: Transparent discharge milestones, medication routine schedules, and instructions

---

## ⚡ Tech Stack & Architecture

- **Frontend**: React 18, Vite
- **Styling**: Vanilla CSS Design System with CSS Custom Properties, modern typography, and responsive grid layouts
- **Routing & State**: Context API, RBAC Route Guard System with audit trail tracking
- **Deployment**: Vercel (zero-config static deployment with client-side SPA rewrites)

---

## 🚀 Running Locally

```bash
# 1. Clone repository
git clone https://github.com/akagamiyokex-sudo/Dischhargeflow_AI.git
cd Dischhargeflow_AI

# 2. Install dependencies
npm install

# 3. Start development server
npm run dev
```

Open [http://localhost:5173](http://localhost:5173) in your browser.

---

## 🌐 Deploy to Vercel (100% Free)

Click the **Deploy with Vercel** button above or:

1. Go to [vercel.com](https://vercel.com) and log in with your GitHub account (`akagamiyokex-sudo`).
2. Click **Add New Project** → **Import** `akagamiyokex-sudo/Dischhargeflow_AI`.
3. Leave all default Vite settings (Framework: Vite, Build: `npm run build`, Output: `dist`).
4. Click **Deploy**. Your app will be live within 30 seconds at a free `*.vercel.app` URL with automated HTTPS/SSL.
