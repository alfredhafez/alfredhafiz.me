const express = require('express');
const cors = require('cors');
const nodemailer = require('nodemailer');
const rateLimit = require('express-rate-limit');
const { body, validationResult } = require('express-validator');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:5173',
  credentials: true
}));
app.use(express.json());

// Rate limiting - prevent spam
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 5, // limit each IP to 5 requests per windowMs
  message: {
    success: false,
    message: 'Too many requests, please try again later.'
  }
});
app.use('/api/contact', limiter);

// Create transporter based on environment variables
const createTransporter = () => {
  // Gmail SMTP
  if (process.env.EMAIL_SERVICE === 'gmail') {
    return nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS, // App password for Gmail
      },
    });
  }
  
  // Custom SMTP (Hostinger, cPanel, etc.)
  if (process.env.EMAIL_SERVICE === 'smtp') {
    return nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: process.env.SMTP_PORT || 587,
      secure: process.env.SMTP_SECURE === 'true',
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
      },
      tls: {
        rejectUnauthorized: false // Allow self-signed certificates
      }
    });
  }
  
  // Outlook/Hotmail
  if (process.env.EMAIL_SERVICE === 'outlook') {
    return nodemailer.createTransport({
      service: 'hotmail',
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });
  }
  
  // Yahoo
  if (process.env.EMAIL_SERVICE === 'yahoo') {
    return nodemailer.createTransport({
      service: 'yahoo',
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });
  }
  
  // Default to custom SMTP configuration
  return nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: process.env.SMTP_PORT || 587,
    secure: process.env.SMTP_PORT == 465,
    auth: {
      user: process.env.SMTP_USER || process.env.EMAIL_USER,
      pass: process.env.SMTP_PASS || process.env.EMAIL_PASS,
    },
  });
};

// Validation middleware
const validateContact = [
  body('name').trim().isLength({ min: 2, max: 100 }).withMessage('Name must be between 2 and 100 characters'),
  body('email').trim().isEmail().normalizeEmail().withMessage('Please provide a valid email'),
  body('subject').trim().isLength({ min: 2, max: 200 }).withMessage('Subject must be between 2 and 200 characters'),
  body('message').trim().isLength({ min: 10, max: 5000 }).withMessage('Message must be between 10 and 5000 characters'),
];

// Contact endpoint
app.post('/api/contact', validateContact, async (req, res) => {
  try {
    // Check validation errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: 'Validation failed',
        errors: errors.array()
      });
    }

    const { name, email, subject, message } = req.body;
    
    // Create transporter
    const transporter = createTransporter();
    
    // Verify connection
    await transporter.verify();
    
    // Email content
    const mailOptions = {
      from: `"Portfolio Contact" <${process.env.EMAIL_FROM || process.env.EMAIL_USER}>`,
      to: process.env.RECIPIENT_EMAIL || process.env.EMAIL_USER,
      replyTo: email,
      subject: `Portfolio Contact: ${subject}`,
      html: `
        <!DOCTYPE html>
        <html>
        <head>
          <meta charset="utf-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>New Contact Form Submission</title>
          <style>
            body { 
              font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; 
              line-height: 1.6; 
              color: #333;
              background-color: #f4f4f4;
              margin: 0;
              padding: 20px;
            }
            .container {
              max-width: 600px;
              margin: 0 auto;
              background: #ffffff;
              border-radius: 10px;
              overflow: hidden;
              box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
            }
            .header {
              background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
              color: white;
              padding: 30px;
              text-align: center;
            }
            .header h1 {
              margin: 0;
              font-size: 24px;
            }
            .content {
              padding: 30px;
            }
            .field {
              margin-bottom: 20px;
              padding: 15px;
              background: #f8f9fa;
              border-radius: 5px;
              border-left: 4px solid #667eea;
            }
            .field-label {
              font-weight: bold;
              color: #667eea;
              margin-bottom: 5px;
              font-size: 12px;
              text-transform: uppercase;
              letter-spacing: 1px;
            }
            .field-value {
              color: #333;
              font-size: 16px;
            }
            .message-box {
              background: #f8f9fa;
              padding: 20px;
              border-radius: 5px;
              border-left: 4px solid #764ba2;
              margin-top: 20px;
            }
            .footer {
              background: #2d3748;
              color: #a0aec0;
              padding: 20px;
              text-align: center;
              font-size: 12px;
            }
            .timestamp {
              color: #718096;
              font-size: 14px;
              margin-top: 20px;
              text-align: center;
            }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>New Portfolio Contact</h1>
              <p style="margin: 10px 0 0 0; opacity: 0.9;">You've received a new message!</p>
            </div>
            
            <div class="content">
              <div class="field">
                <div class="field-label">From</div>
                <div class="field-value">${name}</div>
              </div>
              
              <div class="field">
                <div class="field-label">Email</div>
                <div class="field-value">
                  <a href="mailto:${email}" style="color: #667eea; text-decoration: none;">${email}</a>
                </div>
              </div>
              
              <div class="field">
                <div class="field-label">Subject</div>
                <div class="field-value">${subject}</div>
              </div>
              
              <div class="message-box">
                <div class="field-label">Message</div>
                <div style="margin-top: 10px; line-height: 1.8; color: #4a5568;">
                  ${message.replace(/\n/g, '<br>')}
                </div>
              </div>
              
              <div class="timestamp">
                Sent on ${new Date().toLocaleString('en-US', { 
                  weekday: 'long', 
                  year: 'numeric', 
                  month: 'long', 
                  day: 'numeric', 
                  hour: '2-digit', 
                  minute: '2-digit',
                  timeZoneName: 'short'
                })}
              </div>
            </div>
            
            <div class="footer">
              <p>This email was sent from your portfolio website contact form.</p>
              <p>Reply directly to this email to respond to ${name}.</p>
            </div>
          </div>
        </body>
        </html>
      `,
      text: `
New Contact Form Submission

From: ${name}
Email: ${email}
Subject: ${subject}

Message:
${message}

Sent on: ${new Date().toLocaleString()}
      `,
    };

    // Send email
    const info = await transporter.sendMail(mailOptions);
    
    console.log('Email sent successfully:', info.messageId);
    
    res.json({
      success: true,
      message: 'Your message has been sent successfully! I\'ll get back to you soon.',
      messageId: info.messageId
    });
    
  } catch (error) {
    console.error('Error sending email:', error);
    
    res.status(500).json({
      success: false,
      message: 'Failed to send message. Please try again later or contact me directly via email.',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
});

// Reply endpoint - for sending email replies from admin dashboard
app.post('/api/reply', [
  body('to').trim().isEmail().normalizeEmail().withMessage('Please provide a valid recipient email'),
  body('subject').trim().isLength({ min: 1, max: 200 }).withMessage('Subject is required'),
  body('message').trim().isLength({ min: 1, max: 10000 }).withMessage('Message is required'),
], async (req, res) => {
  try {
    // Check validation errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: 'Validation failed',
        errors: errors.array()
      });
    }

    const { to, subject, message, originalMessageId } = req.body;
    
    // Create transporter
    const transporter = createTransporter();
    
    // Verify connection
    await transporter.verify();
    
    // Email content
    const mailOptions = {
      from: `"Alfred Hafiz" <${process.env.EMAIL_FROM || process.env.EMAIL_USER}>`,
      to: to,
      subject: subject,
      html: `
        <!DOCTYPE html>
        <html>
        <head>
          <meta charset="utf-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>Reply from Alfred Hafiz</title>
          <style>
            body { 
              font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; 
              line-height: 1.6; 
              color: #333;
              background-color: #f4f4f4;
              margin: 0;
              padding: 20px;
            }
            .container {
              max-width: 600px;
              margin: 0 auto;
              background: #ffffff;
              border-radius: 10px;
              overflow: hidden;
              box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
            }
            .header {
              background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
              color: white;
              padding: 30px;
              text-align: center;
            }
            .header h1 {
              margin: 0;
              font-size: 24px;
            }
            .content {
              padding: 30px;
            }
            .message-box {
              background: #f8f9fa;
              padding: 20px;
              border-radius: 5px;
              border-left: 4px solid #667eea;
              margin-top: 20px;
            }
            .footer {
              background: #2d3748;
              color: #a0aec0;
              padding: 20px;
              text-align: center;
              font-size: 12px;
            }
            .signature {
              margin-top: 30px;
              padding-top: 20px;
              border-top: 1px solid #e2e8f0;
            }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>Reply from Alfred Hafiz</h1>
            </div>
            
            <div class="content">
              <div class="message-box">
                <div style="line-height: 1.8; color: #4a5568;">
                  ${message.replace(/\n/g, '<br>')}
                </div>
              </div>
              
              <div class="signature">
                <p style="margin: 0; font-weight: bold; color: #2d3748;">Best regards,</p>
                <p style="margin: 5px 0 0 0; color: #667eea; font-weight: bold;">Alfred Hafiz</p>
                <p style="margin: 5px 0 0 0; font-size: 14px; color: #718096;">
                  <a href="mailto:ask@alfredhafiz.me" style="color: #667eea; text-decoration: none;">ask@alfredhafiz.me</a>
                </p>
              </div>
            </div>
            
            <div class="footer">
              <p>This is a reply to your message sent through my portfolio website.</p>
              <p>Original Message ID: ${originalMessageId || 'N/A'}</p>
            </div>
          </div>
        </body>
        </html>
      `,
      text: `
${message}

Best regards,
Alfred Hafiz
ask@alfredhafiz.me

---
This is a reply to your message sent through my portfolio website.
Original Message ID: ${originalMessageId || 'N/A'}
      `,
    };

    // Send email
    const info = await transporter.sendMail(mailOptions);
    
    console.log('Reply email sent successfully:', info.messageId);
    
    res.json({
      success: true,
      message: 'Reply sent successfully!',
      messageId: info.messageId
    });
    
  } catch (error) {
    console.error('Error sending reply:', error);
    
    res.status(500).json({
      success: false,
      message: 'Failed to send reply. Please try again later.',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
});

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({ status: 'OK', timestamp: new Date().toISOString() });
});

// Start server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  console.log(`SMTP Service: ${process.env.EMAIL_SERVICE || 'custom'}`);
  console.log(`Frontend URL: ${process.env.FRONTEND_URL || 'http://localhost:5173'}`);
});
