# Vercel Deployment Guide

## Overview

This application uses **Vercel** for the frontend and **Supabase** for the backend/database. The email functionality (sending replies) requires a separate backend service.

## Architecture

```
┌─────────────────┐     ┌──────────────────┐     ┌─────────────────┐
│   Vercel        │────▶│   Supabase       │     │  Backend API    │
│   (Frontend)    │     │   (Database)     │     │  (Email Service)│
│                 │     │                  │     │                 │
│  - React App    │     │  - PostgreSQL    │     │  - Express.js   │
│  - Static Site  │     │  - Auth          │     │  - SMTP         │
│  - Admin Panel  │     │  - Realtime      │     │  - Email Replies│
└─────────────────┘     └──────────────────┘     └─────────────────┘
```

## Step 1: Deploy Frontend to Vercel

### Prerequisites
- Vercel account (https://vercel.com)
- GitHub/GitLab/Bitbucket repository with your code

### Deployment Steps

1. **Push your code to GitHub**
   ```bash
   git add .
   git commit -m "Ready for Vercel deployment"
   git push origin main
   ```

2. **Import to Vercel**
   - Go to https://vercel.com/new
   - Import your GitHub repository
   - Vercel will auto-detect Vite/React

3. **Configure Build Settings**
   - **Framework Preset**: Vite
   - **Build Command**: `npm run build`
   - **Output Directory**: `dist`
   
   (These should be auto-detected from `package.json`)

4. **Environment Variables**
   Add these in Vercel Dashboard → Project Settings → Environment Variables:

   ```
   VITE_SUPABASE_URL=https://your-project.supabase.co
   VITE_SUPABASE_ANON_KEY=your-anon-key
   VITE_API_URL=https://your-backend-api.com (optional, for email replies)
   ```

5. **Deploy**
   - Click "Deploy"
   - Wait for build to complete
   - Your site will be live at `https://your-project.vercel.app`

### Custom Domain Setup

1. **In Vercel Dashboard**:
   - Go to Project Settings → Domains
   - Add your domain: `alfredhafiz.me`

2. **In Namecheap (or your DNS provider)**:
   - Go to Domain → Advanced DNS
   - Add these records:
   
   | Type | Host | Value | TTL |
   |------|------|-------|-----|
   | A Record | @ | 76.76.21.21 | Automatic |
   | CNAME Record | www | cname.vercel-dns.com | Automatic |

3. **Wait for DNS propagation** (can take up to 48 hours)

4. **Configure HTTPS**: Vercel provides SSL automatically

## Step 2: Backend Deployment (For Email Replies)

Since Vercel is frontend-focused, you need to deploy the backend separately for email functionality.

### Option A: Railway (Recommended - Free Tier)

1. Go to https://railway.app
2. Click "New Project" → "Deploy from GitHub repo"
3. Select your repository
4. **Configure**:
   - Root Directory: `server`
   - Add environment variables (same as `server/.env`)
5. Deploy and copy the Railway URL
6. Update `VITE_API_URL` in Vercel with the Railway URL

### Option B: Render (Free Tier)

1. Go to https://render.com
2. Create New Web Service
3. Connect your GitHub repo
4. **Configure**:
   - Name: `alfredhafiz-api`
   - Root Directory: `server`
   - Build Command: `npm install`
   - Start Command: `npm start`
   - Add environment variables
5. Deploy and copy the URL

### Option C: Keep Backend Local (Development Only)

For testing without email replies, you can skip the backend. The contact form will still store messages in Supabase, but you won't be able to send email replies from the dashboard.

## Step 3: Update Supabase Configuration

1. **Go to Supabase Dashboard** → Authentication → URL Configuration

2. **Update URLs**:
   - Site URL: `https://alfredhafiz.me` (your custom domain)
   - Redirect URLs:
     ```
     https://alfredhafiz.me/secret-admin-login
     https://alfredhafiz.me/admin/dashboard
     ```

3. **Update CORS Origins** (if needed in Supabase settings)

## 📁 Files Structure for Vercel

When deploying to Vercel, these files/folders are needed:

```
root/
├── src/                    # Source code
│   ├── components/         # React components
│   ├── contexts/          # Auth context
│   ├── lib/               # Supabase client, utils
│   ├── App.tsx            # Main app
│   └── ...
├── index.html             # Entry HTML
├── package.json           # Dependencies
├── vite.config.ts         # Vite config
├── tailwind.config.cjs    # Tailwind config
├── tsconfig.json          # TypeScript config
└── vercel.json            # Vercel configuration
```

**You DON'T need to upload:**
- `node_modules/` (Vercel installs these)
- `dist/` (generated during build)
- `.env.local` (use Vercel environment variables instead)
- `server/` folder (deploy separately for backend)

## 🔧 Environment Variables Reference

### Frontend (Vercel)

| Variable | Required | Description |
|----------|----------|-------------|
| `VITE_SUPABASE_URL` | ✅ Yes | Your Supabase project URL |
| `VITE_SUPABASE_ANON_KEY` | ✅ Yes | Supabase anon/public key |
| `VITE_API_URL` | ❌ No | Backend API URL (for email replies) |

### Backend (Railway/Render)

| Variable | Required | Description |
|----------|----------|-------------|
| `NODE_ENV` | ✅ Yes | Set to `production` |
| `PORT` | ✅ Yes | Usually auto-set by platform |
| `FRONTEND_URL` | ✅ Yes | Your Vercel/Custom domain URL |
| `EMAIL_SERVICE` | ✅ Yes | `gmail`, `smtp`, `outlook` |
| `EMAIL_USER` | ✅ Yes | Your email address |
| `EMAIL_PASS` | ✅ Yes | App password |
| `EMAIL_FROM` | ✅ Yes | Sender email |
| `RECIPIENT_EMAIL` | ✅ Yes | Where to receive emails |

## 🚀 Quick Deployment Checklist

- [ ] Supabase project created and schema applied
- [ ] Storage buckets created (`site-assets`, `attachments`)
- [ ] Admin user created in Supabase Auth
- [ ] Frontend code pushed to GitHub
- [ ] Vercel project created and deployed
- [ ] Environment variables added to Vercel
- [ ] Custom domain configured (optional)
- [ ] Supabase Auth URLs updated with production domain
- [ ] Backend deployed separately (Railway/Render)
- [ ] Backend environment variables configured
- [ ] `VITE_API_URL` updated with backend URL
- [ ] Test contact form submission
- [ ] Test admin login
- [ ] Test email reply functionality

## 🐛 Troubleshooting Vercel Deployment

### Build Errors

**Error: "Cannot find module"**
- Make sure all dependencies are in `package.json`
- Run `npm install` locally to verify

**Error: "Failed to load config"**
- Check `vite.config.ts` exists and is valid
- Ensure `tsconfig.json` is properly configured

### Runtime Errors

**Blank page after deployment**
- Check browser console for errors
- Verify all environment variables are set
- Check if routes are configured in `vercel.json`

**Admin page not loading**
- Check `vercel.json` routes configuration
- Ensure client-side routing is properly set up

**Supabase connection errors**
- Verify `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY`
- Check Supabase project is active
- Verify RLS policies are set up correctly

**Email not working**
- Backend not deployed or URL incorrect
- Check backend logs for errors
- Verify SMTP settings

### Domain Issues

**Custom domain not working**
- DNS propagation can take 24-48 hours
- Check DNS records are correct
- Verify domain in Vercel dashboard shows "Valid Configuration"

**HTTPS not working**
- Vercel provides SSL automatically
- Check if DNS is fully propagated
- Clear browser cache

## 💡 Pro Tips

1. **Preview Deployments**: Vercel creates preview deployments for every pull request
2. **Edge Network**: Your site will be served from Vercel's global CDN
3. **Analytics**: Enable Vercel Analytics for performance insights
4. **Speed Insights**: Monitor Core Web Vitals
5. **Environment Branches**: Set different env vars for production vs preview

## 📝 Important Notes

- **Vercel is static hosting**: Perfect for your React frontend
- **Backend separate**: Email functionality requires separate backend deployment
- **Supabase**: Handles database, auth, and real-time features
- **File uploads**: Use Supabase Storage (already configured)
- **Email**: Use backend API or Supabase Edge Functions

## 📞 Support

- **Vercel Docs**: https://vercel.com/docs
- **Vercel Status**: https://www.vercel-status.com
- **Supabase Docs**: https://supabase.com/docs
- **Community**: Vercel Discord, Supabase Discord

---

**Ready to deploy!** 🚀

1. Set up Supabase (15 mins)
2. Deploy frontend to Vercel (10 mins)
3. Deploy backend to Railway/Render (10 mins)
4. Configure custom domain (5 mins + DNS propagation)
5. Test everything (10 mins)

**Total setup time**: ~50 minutes + DNS propagation
