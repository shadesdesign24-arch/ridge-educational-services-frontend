<p align="center">
  <img src="https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB" />
  <img src="https://img.shields.io/badge/TypeScript-3178C6?style=for-the-badge&logo=typescript&logoColor=white" />
  <img src="https://img.shields.io/badge/Vite-646CFF?style=for-the-badge&logo=vite&logoColor=white" />
  <img src="https://img.shields.io/badge/Tailwind_CSS-06B6D4?style=for-the-badge&logo=tailwindcss&logoColor=white" />
  <img src="https://img.shields.io/badge/Framer_Motion-0055FF?style=for-the-badge&logo=framer&logoColor=white" />
</p>

<h1 align="center">🎓 Ridge Educational Services — Frontend</h1>

<p align="center">
  <b>A stunning, modern React application powering the Ridge Educational Services platform.</b><br/>
  Built with React 19, TypeScript, Vite, Tailwind CSS & Framer Motion for a premium user experience.
</p>

---

## 📋 Table of Contents

- [✨ Overview](#-overview)
- [🖼️ Features](#️-features)
- [🗂️ Project Structure](#️-project-structure)
- [⚙️ Tech Stack](#️-tech-stack)
- [🚀 Getting Started](#-getting-started)
- [📄 Pages & Components](#-pages--components)
- [🎨 Design System](#-design-system)
- [🔗 API Integration](#-api-integration)
- [👥 User Roles](#-user-roles)
- [🤝 Contributing](#-contributing)

---

## ✨ Overview

Ridge Educational Services is a **premium educational consultancy platform** that connects students with the right colleges based on their academic performance. The frontend provides an elegant, responsive interface for:

- 🏠 **Public Homepage** — Beautiful landing page with services, partner colleges, testimonials, and consultation form
- 🔐 **Authentication** — Secure login for Admin & Employee roles
- 🛡️ **Admin Dashboard** — Full college management, employee management, bulk uploads, and consultation lead tracking
- 👨‍💼 **Employee Dashboard** — Eligibility checker, student CRM, admission booking, and lead management
- 📱 **Fully Responsive** — Optimized for desktop, tablet, and mobile screens

---

## 🖼️ Features

### 🏠 Public Website
| Feature | Description |
|:---|:---|
| 🎯 Hero Section | Eye-catching hero with gradient backgrounds and call-to-action |
| 📚 Services | Educational services overview with animated cards |
| 🏫 Partner Colleges | Scrolling carousel of partner institution logos |
| ⭐ Testimonials | Student success stories and reviews |
| 📋 Consultation Form | Free/Paid consultation request with email notifications |
| 🔐 Login | Secure authentication for Admin & Employee |

### 🛡️ Admin Dashboard
| Feature | Description |
|:---|:---|
| 🏫 College Management | Add, view, edit, delete colleges with master-detail view |
| 📊 Cutoff Marks | Manage course-wise cutoff marks per college |
| 💰 Fee Structure | Year-wise fees, admission fee, health card, application fees |
| 👥 Employee Management | Create and manage employee accounts |
| 📤 Bulk Upload | Import college data from Excel (.xlsx) files |
| 📋 Consultation Leads | View all leads, bulk assign to employees, add manual leads |
| 🔍 College Search | Search and filter colleges with live search |

### 👨‍💼 Employee Dashboard
| Feature | Description |
|:---|:---|
| 🎯 Eligibility Checker | Check student eligibility by marks, course & category |
| 🏫 Matching Colleges | View eligible colleges with cutoff details |
| 💰 Fee Display | Complete fee breakdown shown for each matched college |
| 📖 Admission Booking | Book admissions for eligible students |
| 📞 Student CRM | Save student details for follow-up |
| 📋 Assigned Leads | View and manage consultation leads |
| 🏷️ Lead Status | Update lead status (Assigned → Completed / Dead Lead) |

---

## 🗂️ Project Structure

```
ridge-educational-services-frontend/
├── 📄 .gitignore                    # Git ignore rules
├── 📄 index.html                    # HTML entry point with SEO meta tags
├── 📄 index.tsx                     # React app bootstrap & routing
├── 📄 App.tsx                       # 🏠 Main homepage & consultation form
├── 📄 Partners.tsx                  # 🏫 Partner colleges page
├── 📄 constants.tsx                 # API URLs & app constants
├── 📄 types.ts                      # TypeScript type definitions
├── 📄 vite.config.ts                # Vite bundler configuration
├── 📄 tsconfig.json                 # TypeScript configuration
├── 📄 package.json                  # Dependencies & scripts
├── 📁 assets/                       # Images & media
│   ├── 🖼️ RES-logo.jpeg             # Company logo
│   ├── 🖼️ RES-award.JPG             # Award image
│   ├── 🖼️ res-award.png             # Award badge
│   ├── 🖼️ inda-res.png              # India map graphic
│   ├── 🖼️ lets_scucess.png          # Success image
│   ├── 🖼️ RES-logo-night.png        # Dark mode logo
│   └── 📁 res-colleges/             # Partner college logos (14 images)
└── 📁 pages/                        # Application pages
    ├── 📄 AdminPanel.tsx            # 🛡️ Full admin dashboard
    ├── 📄 Auth.tsx                  # 🔐 Login page
    └── 📄 EmployeePanel.tsx         # 👨‍💼 Employee dashboard
```

---

## ⚙️ Tech Stack

| Technology | Purpose |
|:---:|:---|
| **React 19** | UI component library |
| **TypeScript** | Type-safe development |
| **Vite** | Lightning-fast build tool |
| **Tailwind CSS** | Utility-first CSS framework |
| **Framer Motion** | Smooth animations & transitions |
| **React Router v7** | Client-side routing |
| **Axios** | HTTP API client |
| **React Hot Toast** | Beautiful toast notifications |
| **Font Awesome** | Icon library |
| **Google Material Icons** | Material design icons |
| **Google Fonts (Outfit)** | Premium typography |

---

## 🚀 Getting Started

### Prerequisites

- **Node.js** v18+ installed
- **Backend API** running on `http://localhost:5000` ([Backend Repo](https://github.com/shadesdesign24-arch/ridge-educational-services-backend))

### Installation

```bash
# 1. Clone the repository
git clone https://github.com/shadesdesign24-arch/ridge-educational-services-frontend.git

# 2. Navigate to the project
cd ridge-educational-services-frontend

# 3. Install dependencies
npm install

# 4. Start development server
npm run dev
```

The app will be available at **`http://localhost:5173`** 🚀

### Available Scripts

| Script | Command | Description |
|:---|:---|:---|
| 🔧 Dev | `npm run dev` | Start Vite dev server with HMR |
| 🏗️ Build | `npm run build` | Build for production |
| 👁️ Preview | `npm run preview` | Preview production build |

---

## 📄 Pages & Components

### 🏠 Homepage (`App.tsx`)
The main landing page with multiple sections:

```
┌─────────────────────────────────────────┐
│           🔝 Navigation Bar              │
├─────────────────────────────────────────┤
│           🎯 Hero Section                │
│     "Empowering Students for Success"    │
├─────────────────────────────────────────┤
│           📚 Our Services                │
│    Counselling · Admissions · Support    │
├─────────────────────────────────────────┤
│           🏫 Partner Colleges            │
│      Scrolling logo carousel             │
├─────────────────────────────────────────┤
│           ⭐ Testimonials                │
│      Student success stories             │
├─────────────────────────────────────────┤
│           📋 Consultation Form           │
│   Name · Phone · Email · Interest · Type │
├─────────────────────────────────────────┤
│           📞 Footer & Contact            │
└─────────────────────────────────────────┘
```

### 🔐 Login Page (`Auth.tsx`)
- Clean, minimal login form
- Session-based authentication
- Role-based redirect (Admin → Admin Panel, Employee → Employee Panel)

### 🛡️ Admin Panel (`AdminPanel.tsx`)
**4 Tabs:**
1. **Colleges** — Master-detail view with search, add/edit/delete
2. **Employees** — Create employee accounts
3. **Consultations** — View leads, bulk assign, add manual leads
4. **Bulk Upload** — Excel import with preview

### 👨‍💼 Employee Panel (`EmployeePanel.tsx`)
**2 Tabs:**
1. **Eligibility & CRM** — Check marks, view matching colleges with fees, book admissions
2. **My Leads** — Manage assigned consultation leads

---

## 🎨 Design System

### Color Palette

| Color | Hex | Usage |
|:---|:---|:---|
| 🟦 Primary (Navy) | `#0F172A` | Headers, buttons, dark backgrounds |
| 🟡 Accent (Gold) | `#F59E0B` | CTAs, highlights, active states |
| ⬜ Background | `#FFFFFF` | Cards, content areas |
| 🔘 Slate | `#64748B` | Secondary text, borders |
| 🟢 Success | `#22C55E` | Match badges, success states |
| 🔴 Danger | `#EF4444` | Delete buttons, error states |

### Typography
- **Font Family:** `Outfit` (Google Fonts)
- **Display:** Black weight for headings
- **Body:** Bold/Medium for content
- **Labels:** Extra-small, uppercase, wide tracking

### Design Principles
- 🌊 **Glassmorphism** — Frosted glass effects on cards
- ✨ **Micro-animations** — Smooth hover and entrance transitions
- 📐 **Large border radius** — Rounded corners (2rem+) throughout
- 🎭 **Dark mode support** — Full dark theme compatibility
- 💎 **Premium feel** — Shadow hierarchies and spacing system

---

## 🔗 API Integration

The frontend connects to the backend API at `http://localhost:5000`. All authenticated requests include a JWT token in the `Authorization` header.

```typescript
// Example API call
const token = sessionStorage.getItem('token');
const headers = { Authorization: `Bearer ${token}` };

const res = await axios.get('http://localhost:5000/api/admin/colleges', { headers });
```

### API Base URLs
| Route Group | Base URL |
|:---|:---|
| Public | `http://localhost:5000/api` |
| Auth | `http://localhost:5000/api/auth` |
| Admin | `http://localhost:5000/api/admin` |
| Employee | `http://localhost:5000/api/employee` |

---

## 👥 User Roles

### 🔐 Authentication Flow

```
User enters credentials
        │
        ▼
   POST /api/auth/login
        │
        ▼
  Server validates & returns JWT + role
        │
        ▼
  Token stored in sessionStorage
        │
   ┌────┴────┐
   ▼         ▼
 Admin    Employee
   │         │
   ▼         ▼
/admin    /employee
 Panel     Panel
```

### Access Control

| Page | Public | Admin | Employee |
|:---|:---:|:---:|:---:|
| Homepage | ✅ | ✅ | ✅ |
| Consultation Form | ✅ | ✅ | ✅ |
| Partners Page | ✅ | ✅ | ✅ |
| Login | ✅ | ➖ | ➖ |
| Admin Dashboard | ❌ | ✅ | ❌ |
| Employee Dashboard | ❌ | ❌ | ✅ |

---

## 🌐 Browser Support

| Browser | Supported |
|:---|:---:|
| Chrome 90+ | ✅ |
| Firefox 88+ | ✅ |
| Safari 14+ | ✅ |
| Edge 90+ | ✅ |

---

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

---

## 📎 Related Repository

- 🔗 **Backend API:** [ridge-educational-services-backend](https://github.com/shadesdesign24-arch/ridge-educational-services-backend)

---

<p align="center">
  Made with ❤️ by <b>Ridge Educational Services</b>
</p>
