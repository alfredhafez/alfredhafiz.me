# SMTP Email Server Setup for Portfolio

This backend server handles contact form submissions and sends emails via SMTP.

## Quick Setup

### 1. Install Dependencies

```bash
cd server
npm install
```

### 2. Configure Environment Variables

```bash
cp .env.example .env
```

Edit `.env` with your SMTP details.

### 3. Gmail Setup (Recommended for beginners)

1. Go to your Google Account settings
2. Enable 2-Factor Authentication
3. Generate an App Password:
   - Go to Security → App passwords
   - Select "Mail" and your device
   - Copy the 16-character password
4. Update `.env`:
```
EMAIL_SERVICE=gmail
EMAIL_USER=your-email@gmail.com
EMAIL_PASS=xxxx xxxx xxxx xxxx  (your app password)
RECIPIENT_EMAIL=ask@alfredhafiz.me
```

### 4. Custom SMTP (Hostinger, cPanel, etc.)

For your own domain email:
```
EMAIL_SERVICE=smtp
SMTP_HOST=mail.alfredhafiz.me
SMTP_PORT=587
SMTP_SECURE=false
SMTP_USER=contact@alfredhafiz.me
SMTP_PASS=your-email-password
RECIPIENT_EMAIL=ask@alfredhafiz.me
```

### 5. Run the Server

Development:
```bash
npm run dev
```

Production:
```bash
npm start
```

## Deployment Options

### Option 1: VPS/Cloud Server (Recommended)

Deploy to DigitalOcean, AWS, or any VPS:

```bash
# On your server
git clone <your-repo>
cd <your-repo>/server
npm install
npm start
```

Use PM2 for process management:
```bash
npm install -g pm2
pm2 start server.js --name "portfolio-api"
pm2 startup
pm2 save
```

### Option 2: Railway/Render (Free)

1. Push code to GitHub
2. Connect Railway or Render
3. Add environment variables in dashboard
4. Deploy automatically

### Option 3: Vercel/Netlify Functions

For serverless deployment, use the API routes version (see `api/` folder).

## Testing

Test the endpoint:
```bash
curl -X POST http://localhost:3001/api/contact \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Test User",
    "email": "test@example.com",
    "subject": "Test Message",
    "message": "This is a test message from the contact form."
  }'
```

## Security Features

- ✅ Rate limiting (5 requests per 15 minutes per IP)
- ✅ Input validation and sanitization
- ✅ CORS protection
- ✅ Environment variable protection
- ✅ No sensitive data in logs

## Troubleshooting

### Gmail Authentication Failed
- Make sure you're using an App Password, not your regular password
- Ensure "Less secure app access" is enabled (if not using 2FA)
- Check if 2-Factor Authentication is enabled

### SMTP Connection Refused
- Verify SMTP host and port
- Check if firewall allows outgoing connections on port 587/465
- Try different port (587 for TLS, 465 for SSL)

### Emails Not Received
- Check spam/junk folders
- Verify recipient email address
- Check server logs for errors
- Test with a different sender email

## Environment Variables Reference

| Variable | Description | Example |
|----------|-------------|---------|
| `PORT` | Server port | `3001` |
| `FRONTEND_URL` | Your frontend URL | `https://alfredhafiz.me` |
| `EMAIL_SERVICE` | Email provider | `gmail`, `smtp`, `outlook` |
| `EMAIL_USER` | Your email address | `you@gmail.com` |
| `EMAIL_PASS` | Email password or app password | `xxxx xxxx xxxx xxxx` |
| `SMTP_HOST` | SMTP server hostname | `smtp.gmail.com` |
| `SMTP_PORT` | SMTP port | `587` or `465` |
| `SMTP_SECURE` | Use SSL/TLS | `false` or `true` |
| `RECIPIENT_EMAIL` | Where to receive emails | `ask@alfredhafiz.me` |
