# Alfred Hafiz - Full-Stack Portfolio

A modern, high-end personal portfolio website with full admin dashboard, database integration, and email management system.

🌐 **Live URL**: https://alfredhafiz.me

## 🎯 Overview

This is a complete full-stack portfolio application featuring:
- Beautiful, animated frontend portfolio
- Secure admin dashboard with authentication
- PostgreSQL database for contact form storage
- Real-time message notifications
- Email reply system
- Site settings management

## 🛠 Tech Stack

### Frontend
- **Framework**: React 18 + Vite
- **UI Library**: shadcn/ui + Radix UI
- **Styling**: Tailwind CSS
- **Animations**: Framer Motion
- **Icons**: Lucide React
- **TypeScript**: Full type safety

### Backend & Database
- **Database**: Supabase (PostgreSQL)
- **Authentication**: Supabase Auth
- **Storage**: Supabase Storage
- **Real-time**: Supabase Realtime
- **API**: Express.js (for email service)

### Deployment
- **Frontend**: Vercel
- **Backend**: Railway/Render (for email functionality)

## 📁 Project Structure

```
alfredhafiz-portfolio/
├── src/
│   ├── components/
│   │   ├── ui/                 # shadcn/ui components
│   │   ├── admin/              # Admin dashboard components
│   │   │   ├── AdminDashboard.tsx
│   │   │   ├── AdminLayout.tsx
│   │   │   ├── AdminLogin.tsx
│   │   │   ├── MessagesPage.tsx
│   │   │   ├── ProtectedRoute.tsx
│   │   │   └── SettingsPage.tsx
│   │   ├── sections/           # Portfolio sections
│   │   │   ├── Hero.tsx
│   │   │   ├── About.tsx
│   │   │   ├── Skills.tsx
│   │   │   ├── Projects.tsx
│   │   │   ├── Services.tsx
│   │   │   └── Contact.tsx
│   │   ├── CustomCursor.tsx
│   │   ├── Footer.tsx
│   │   └── Navigation.tsx
│   ├── contexts/
│   │   └── AuthContext.tsx     # Authentication provider
│   ├── lib/
│   │   ├── supabase.ts         # Supabase client & helpers
│   │   ├── database.types.ts   # TypeScript types
│   │   └── utils.ts
│   ├── App.tsx
│   ├── main.tsx
│   └── index.css
├── server/                     # Backend API (separate deployment)
│   ├── server.js
│   ├── package.json
│   └── .env.example
├── supabase/
│   └── schema.sql              # Database schema
├── .env.example
├── index.html
├── package.json
├── tsconfig.json
├── tailwind.config.js
├── postcss.config.js
├── vite.config.ts
└── vercel.json                 # Vercel deployment config
```

## ✨ Features

### Portfolio Frontend
1. **Hero** - Animated introduction with call-to-actions
2. **About** - Professional summary with stats
3. **Skills** - Categorized skills showcase
4. **Projects** - Portfolio project gallery
5. **Services** - Service offerings
6. **Contact** - Contact form with database storage

### Admin Dashboard
- **Authentication** - Secure login with Supabase Auth
- **Dashboard** - Message statistics and recent activity
- **Messages** - View, search, and manage contact form submissions
- **Reply System** - Send email replies directly from dashboard
- **Settings** - Manage site configuration, logo, favicon, SMTP
- **Real-time Updates** - Live notifications for new messages

### Database Features
- Contact form messages stored in PostgreSQL
- Row Level Security (RLS) policies
- Real-time subscriptions
- File storage for logos and attachments
- Admin activity logging

## 🚀 Getting Started

### Prerequisites

- Node.js 18+
- npm or yarn
- Supabase account (free tier)

### Quick Setup

1. **Clone the repository:**
```bash
git clone <repository-url>
cd alfredhafiz-portfolio
```

2. **Install dependencies:**
```bash
npm install
cd server && npm install && cd ..
```

3. **Set up Supabase:**
   - Create project at https://supabase.com
   - Run SQL schema from `supabase/schema.sql`
   - Create storage buckets: `site-assets` (public), `attachments` (private)
   - Create admin user in Authentication → Users
   - Copy Project URL and Anon Key

4. **Configure environment variables:**
```bash
# Frontend
cp .env.example .env.local
# Add: VITE_SUPABASE_URL, VITE_SUPABASE_ANON_KEY

# Backend (optional - for email replies)
cp server/.env.example server/.env
# Add: Email SMTP settings
```

5. **Start development servers:**
```bash
# Terminal 1 - Frontend
npm run dev

# Terminal 2 - Backend (optional)
cd server && npm run dev
```

6. **Access:**
   - Portfolio: http://localhost:5173
   - Admin Login: http://localhost:5173/secret-admin-login

### Build for Production

```bash
npm run build
```

The built files will be in the `dist` directory.

## 🌐 Deployment

### Deploy to Vercel (Frontend)

See detailed guide: [`VERCEL_DEPLOY.md`](./VERCEL_DEPLOY.md)

Quick steps:
1. Push code to GitHub
2. Import to [Vercel](https://vercel.com)
3. Add environment variables
4. Deploy!

### Deploy Backend (Email Service)

The backend API for sending email replies needs separate deployment:
- **Railway** (recommended): https://railway.app
- **Render**: https://render.com

See `server/README.md` for backend deployment details.

## 🎨 Design Features

- **Dark Theme**: Professional dark color palette with blue accents
- **Smooth Animations**: Powered by Framer Motion
- **Fully Responsive**: Optimized for desktop, tablet, and mobile
- **Modern UI**: shadcn/ui components with custom styling
- **Performance**: Fast loading with Vite build tool

## 📧 Contact

- **Email**: ask@alfredhafiz.me
- **WhatsApp**: +880 1944-003260
- **Location**: Dhaka, Bangladesh

## 📝 License

This project is private and proprietary. All rights reserved.

---

Built with ❤️ by Alfred Hafiz