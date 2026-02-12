# Complete Setup & Deployment Guide

This guide will walk you through setting up and deploying your full-stack portfolio with Supabase integration.

## 🎯 What You Get

✅ **Frontend**: React + Vite + TypeScript + Tailwind CSS  
✅ **Backend**: Express.js API with SMTP email support  
✅ **Database**: Supabase PostgreSQL with real-time updates  
✅ **Authentication**: Secure admin login system  
✅ **Admin Dashboard**: Manage messages, settings, and site configuration  
✅ **File Storage**: Upload logos, favicons, and attachments  
✅ **Email System**: Send replies directly from the admin dashboard  

---

## 📋 Prerequisites

Before starting, make sure you have:

1. **Node.js 18+** installed
2. **A Supabase account** (free tier works great)
3. **A Render account** (for deployment)
4. **Domain configured** (Namecheap, Cloudflare, etc.)

---

## 🚀 Step 1: Supabase Setup

### 1.1 Create Supabase Project

1. Go to [https://supabase.com](https://supabase.com)
2. Click "New Project"
3. Choose your organization
4. Set project name: `alfredhafiz-portfolio`
5. Choose a region closest to your users
6. Set a secure database password
7. Wait for the project to be created (takes ~2 minutes)

### 1.2 Run Database Schema

1. In your Supabase dashboard, go to **SQL Editor**
2. Click **New Query**
3. Copy the contents of `supabase/schema.sql` from this repo
4. Paste it into the SQL Editor
5. Click **Run**

This creates:
- `contact_messages` table (stores all contact form submissions)
- `site_settings` table (stores site configuration)
- `admin_activity_log` table (tracks admin actions)
- Row Level Security (RLS) policies
- Real-time subscriptions

### 1.3 Create Storage Buckets

1. Go to **Storage** in the left sidebar
2. Click **New bucket**
3. Create bucket named: `site-assets`
   - Enable **Public access**
4. Create bucket named: `attachments`
   - Keep **Private** (only authenticated users can access)

### 1.4 Set Up Authentication

1. Go to **Authentication** → **Providers**
2. Enable **Email** provider
3. Go to **Authentication** → **URL Configuration**
   - Site URL: `https://your-domain.com` (or `http://localhost:5173` for local)
   - Redirect URLs: Add `https://your-domain.com/secret-admin-login`

### 1.5 Create Admin User

**Using Supabase Dashboard:**
1. Go to **Authentication** → **Users**
2. Click **Add User**
3. Enter your admin email
4. Set a strong password
5. Click **Create User**

### 1.6 Get API Keys

1. Go to **Project Settings** → **API**
2. Copy the following:
   - **Project URL** (e.g., `https://xxxxx.supabase.co`)
   - **anon public** API key

Save these for the next step!

---

## 💻 Step 2: Local Development Setup

### 2.1 Install Dependencies

```bash
# Install frontend dependencies
npm install

# Install backend dependencies
cd server
npm install
cd ..
```

### 2.2 Environment Variables

**Frontend Environment**

1. Copy `.env.example` to `.env.local`:
   ```bash
   cp .env.example .env.local
   ```

2. Edit `.env.local`:
   ```env
   VITE_SUPABASE_URL=your_supabase_project_url
   VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
   VITE_API_URL=http://localhost:3001
   ```

**Backend Environment**

1. Copy `server/.env.example` to `server/.env`:
   ```bash
   cp server/.env.example server/.env
   ```

2. Edit `server/.env`:
   ```env
   PORT=3001
   FRONTEND_URL=http://localhost:5173
   NODE_ENV=development
   
   # Email configuration (for sending notifications)
   EMAIL_SERVICE=gmail
   EMAIL_USER=your-email@gmail.com
   EMAIL_PASS=your-app-password
   
   EMAIL_FROM=noreply@alfredhafiz.me
   RECIPIENT_EMAIL=ask@alfredhafiz.me
   ```

**Note**: If using Gmail, you need an [App Password](https://support.google.com/accounts/answer/185833), not your regular password.

### 2.3 Start Development Servers

**Terminal 1 - Frontend:**
```bash
npm run dev
```
The frontend will run on http://localhost:5173

**Terminal 2 - Backend:**
```bash
cd server
npm run dev
```
The backend will run on http://localhost:3001

### 2.4 Test the Setup

1. Open http://localhost:5173
2. Test the contact form - submit a message
3. Check Supabase Table Editor → `contact_messages` - you should see the message!
4. Go to http://localhost:5173/secret-admin-login
5. Login with your admin credentials
6. You should see the admin dashboard with your message

---

## 🌐 Step 3: Production Deployment

### 3.1 Deploy to Render

We recommend using Render for easy deployment. The `render.yaml` file is already configured!

**Option A: Blueprint (Recommended)**

1. Push your code to GitHub
2. Go to [https://dashboard.render.com/blueprints](https://dashboard.render.com/blueprints)
3. Click **New Blueprint Instance**
4. Connect your GitHub repository
5. Render will automatically detect `render.yaml` and create:
   - Backend API service
   - Frontend static site
6. Click **Apply**

**Option B: Manual Setup**

**Backend Service:**
1. Go to [https://dashboard.render.com/](https://dashboard.render.com/)
2. Click **New** → **Web Service**
3. Connect your GitHub repo
4. Configure:
   - **Name**: `alfredhafiz-api`
   - **Root Directory**: `server`
   - **Runtime**: Node
   - **Build Command**: `npm install`
   - **Start Command**: `npm start`

**Frontend Static Site:**
1. Click **New** → **Static Site**
2. Connect your GitHub repo
3. Configure:
   - **Name**: `alfredhafiz-frontend`
   - **Build Command**: `npm install && npm run build`
   - **Publish Directory**: `dist`

### 3.2 Configure Environment Variables on Render

**Backend Service:**
```
NODE_ENV=production
PORT=10000
FRONTEND_URL=https://your-frontend-url.onrender.com

EMAIL_SERVICE=gmail
EMAIL_USER=ask@alfredhafiz.me
EMAIL_PASS=your-app-password
EMAIL_FROM=ask@alfredhafiz.me
RECIPIENT_EMAIL=ask@alfredhafiz.me
```

**Frontend Static Site:**
```
VITE_API_URL=https://your-backend-url.onrender.com
VITE_SUPABASE_URL=your_supabase_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
```

### 3.3 Update Supabase Auth URL

1. Go to Supabase Dashboard → Authentication → URL Configuration
2. Update **Site URL** to your production URL
3. Add **Redirect URLs**:
   - `https://your-domain.com/secret-admin-login`
   - `https://your-domain.com/admin/dashboard`

### 3.4 Configure Custom Domain

**In Render Dashboard:**
1. Go to your frontend service
2. Click **Settings** → **Custom Domains**
3. Add your domain: `alfredhafiz.me`

**In Namecheap (or DNS provider):**
1. Go to DNS Management
2. Add CNAME record:
   - Type: CNAME
   - Host: @
   - Value: your-service.onrender.com

Wait for DNS propagation (5 minutes to 48 hours)

---

## 🔐 Security Checklist

Before going live:

- [ ] Change the admin login URL from `/secret-admin-login` to something only you know
- [ ] Use strong, unique passwords for Supabase admin
- [ ] Enable Row Level Security (already done in schema)
- [ ] Set up rate limiting (already configured)
- [ ] Use HTTPS (Render provides this automatically)
- [ ] Set up proper email authentication (SPF, DKIM, DMARC)

---

## 🎨 Customizing Your Site

### Update Site Settings

1. Login to admin dashboard: `https://your-domain.com/secret-admin-login`
2. Go to **Settings**
3. Update:
   - Site name and description
   - Hero title and subtitle
   - Contact email
   - Upload logo and favicon

### Configure SMTP for Replies

1. In Admin Dashboard → Settings → SMTP
2. Enable SMTP
3. Enter your SMTP details:
   - **Host**: `smtp.gmail.com`
   - **Port**: `587`
   - **Username**: `ask@alfredhafiz.me`
   - **Password**: Your app password
4. Save settings

---

## 🐛 Troubleshooting

### Contact form not working
- Check browser console for errors
- Verify Supabase URL and anon key
- Check Supabase RLS policies

### Can't login to admin
- Verify admin user exists in Supabase Auth
- Check Supabase URL configuration matches your domain

### Emails not sending
- Check backend logs on Render
- Verify SMTP settings
- Use app password, not regular password

### Real-time updates not working
- Check Supabase Realtime is enabled
- Verify table has realtime publication

---

## 📞 Support

- **Supabase Docs**: https://supabase.com/docs
- **Render Docs**: https://render.com/docs
- **Check Logs**: In Render dashboard, view service logs

---

## 🎉 Success!

You now have a fully functional full-stack portfolio with admin dashboard, database, and email system!

Happy coding! 🚀
