const nodemailer = require('nodemailer');
const fs = require('fs');
const path = require('path');

const sendVerificationEmail = async (email, name, token) => {
  const verifyUrl = `${process.env.CLIENT_URL || 'http://localhost:3000'}/verify-email?email=${encodeURIComponent(email)}&token=${token}`;
  
  const emailHtml = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <title>Verify your email - Aatmanirbhar Nari</title>
      <style>
        body {
          font-family: 'Plus Jakarta Sans', -apple-system, BlinkMacSystemFont, sans-serif;
          background-color: #F7F5F0;
          color: #0a0a0a;
          margin: 0;
          padding: 0;
        }
        .container {
          max-width: 600px;
          margin: 40px auto;
          background-color: #ffffff;
          padding: 40px;
          border-radius: 16px;
          border: 1px solid rgba(0, 0, 0, 0.05);
          box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.02), 0 20px 40px -8px rgba(0, 0, 0, 0.05);
        }
        .header {
          text-align: center;
          margin-bottom: 30px;
        }
        .logo {
          font-size: 28px;
          font-weight: bold;
          color: #0a0a0a;
          text-decoration: none;
        }
        .content {
          font-size: 16px;
          line-height: 1.6;
          color: #4A4A4A;
        }
        .code-box {
          text-align: center;
          margin: 30px 0;
        }
        .code-text {
          font-size: 32px;
          font-weight: 800;
          letter-spacing: 6px;
          background-color: #F4F4F6;
          padding: 12px 24px;
          border-radius: 10px;
          display: inline-block;
          color: #000000;
          border: 1px solid rgba(0, 0, 0, 0.05);
        }
        .button-container {
          text-align: center;
          margin: 30px 0;
        }
        .button {
          background-color: #0a0a0a;
          color: #ffffff !important;
          padding: 14px 28px;
          text-decoration: none;
          font-size: 16px;
          font-weight: 600;
          border-radius: 8px;
          display: inline-block;
          box-shadow: 0 10px 20px -5px rgba(0, 0, 0, 0.2);
        }
        .footer {
          margin-top: 40px;
          text-align: center;
          font-size: 12px;
          color: #999999;
          border-top: 1px solid rgba(0, 0, 0, 0.05);
          padding-top: 20px;
        }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <span class="logo">Aatmanirbhar Nari</span>
        </div>
        <div class="content">
          <p>Hello ${name},</p>
          <p>Thank you for registering with Aatmanirbhar Nari. Please enter the following 6-digit verification code in the application to activate your account:</p>
          <div class="code-box">
            <span class="code-text">${token}</span>
          </div>
          <p>Alternatively, you can verify your account automatically by clicking the button below:</p>
          <div class="button-container">
            <a href="${verifyUrl}" class="button" target="_blank">Verify Email Address</a>
          </div>
          <p>If the button doesn't work, you can copy and paste the following link into your browser:</p>
          <p style="word-break: break-all; color: #666666; font-size: 14px;">
            <a href="${verifyUrl}">${verifyUrl}</a>
          </p>
          <p>This verification code and link will expire in 15 minutes.</p>
          <p>Best regards,<br>The Aatmanirbhar Nari Team</p>
        </div>
        <div class="footer">
          &copy; 2026 Aatmanirbhar Nari. All rights reserved.
        </div>
      </div>
    </body>
    </html>
  `;

  const isConfigured = 
    process.env.EMAIL_USER && 
    process.env.EMAIL_USER !== 'your-email@gmail.com' &&
    process.env.EMAIL_PASS &&
    process.env.EMAIL_PASS !== 'your-app-password';

  if (isConfigured) {
    try {
      const transporter = nodemailer.createTransport({
        host: process.env.EMAIL_HOST || 'smtp.gmail.com',
        port: parseInt(process.env.EMAIL_PORT || '587'),
        secure: process.env.EMAIL_PORT === '465',
        auth: {
          user: process.env.EMAIL_USER,
          pass: process.env.EMAIL_PASS,
        },
      });

      await transporter.sendMail({
        from: `"Aatmanirbhar Nari" <${process.env.EMAIL_USER}>`,
        to: email,
        subject: 'Verify Your Email - Aatmanirbhar Nari',
        html: emailHtml,
      });

      console.log(`[Email] Verification email sent to ${email}`);
      return;
    } catch (error) {
      console.error('[Email Error] Failed to send email via SMTP:', error);
      // Fallback to console in case of error
    }
  }

  // Development Fallback: console log and local file preview
  console.log('\n' + '='.repeat(80));
  console.log(`[DEVELOPMENT EMAIL FALLBACK]`);
  console.log(`To: ${email}`);
  console.log(`Subject: Verify Your Email - Aatmanirbhar Nari`);
  console.log(`Verification URL: ${verifyUrl}`);
  console.log('='.repeat(80) + '\n');

  try {
    const previewDir = path.join(__dirname, '..', 'uploads');
    if (!fs.existsSync(previewDir)) {
      fs.mkdirSync(previewDir, { recursive: true });
    }
    const previewPath = path.join(previewDir, 'email-preview.html');
    fs.writeFileSync(previewPath, emailHtml);
    console.log(`[DEVELOPMENT EMAIL PREVIEW] Saved preview to ${previewPath}`);
  } catch (err) {
    console.error('Failed to save email preview file:', err);
  }
};

const sendPasswordResetEmail = async (email, name, token) => {
  const emailHtml = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <title>Reset your password - Aatmanirbhar Nari</title>
      <style>
        body {
          font-family: 'Plus Jakarta Sans', -apple-system, BlinkMacSystemFont, sans-serif;
          background-color: #F7F5F0;
          color: #0a0a0a;
          margin: 0;
          padding: 0;
        }
        .container {
          max-width: 600px;
          margin: 40px auto;
          background-color: #ffffff;
          padding: 40px;
          border-radius: 16px;
          border: 1px solid rgba(0, 0, 0, 0.05);
          box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.02), 0 20px 40px -8px rgba(0, 0, 0, 0.05);
        }
        .header {
          text-align: center;
          margin-bottom: 30px;
        }
        .logo {
          font-size: 28px;
          font-weight: bold;
          color: #0a0a0a;
          text-decoration: none;
        }
        .content {
          font-size: 16px;
          line-height: 1.6;
          color: #4A4A4A;
        }
        .code-box {
          text-align: center;
          margin: 30px 0;
        }
        .code-text {
          font-size: 32px;
          font-weight: 800;
          letter-spacing: 6px;
          background-color: #F4F4F6;
          padding: 12px 24px;
          border-radius: 10px;
          display: inline-block;
          color: #000000;
          border: 1px solid rgba(0, 0, 0, 0.05);
        }
        .footer {
          margin-top: 40px;
          text-align: center;
          font-size: 12px;
          color: #999999;
          border-top: 1px solid rgba(0, 0, 0, 0.05);
          padding-top: 20px;
        }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <span class="logo">Aatmanirbhar Nari</span>
        </div>
        <div class="content">
          <p>Hello ${name},</p>
          <p>We received a request to reset the password for your Aatmanirbhar Nari account. Please enter the following 6-digit verification code to reset your password:</p>
          <div class="code-box">
            <span class="code-text">${token}</span>
          </div>
          <p>This verification code will expire in 15 minutes.</p>
          <p>If you did not request a password reset, please ignore this email.</p>
          <p>Best regards,<br>The Aatmanirbhar Nari Team</p>
        </div>
        <div class="footer">
          &copy; 2026 Aatmanirbhar Nari. All rights reserved.
        </div>
      </div>
    </body>
    </html>
  `;

  const isConfigured = 
    process.env.EMAIL_USER && 
    process.env.EMAIL_USER !== 'your-email@gmail.com' &&
    process.env.EMAIL_PASS &&
    process.env.EMAIL_PASS !== 'your-app-password';

  if (isConfigured) {
    try {
      const transporter = nodemailer.createTransport({
        host: process.env.EMAIL_HOST || 'smtp.gmail.com',
        port: parseInt(process.env.EMAIL_PORT || '587'),
        secure: process.env.EMAIL_PORT === '465',
        auth: {
          user: process.env.EMAIL_USER,
          pass: process.env.EMAIL_PASS,
        },
      });

      await transporter.sendMail({
        from: `"Aatmanirbhar Nari" <${process.env.EMAIL_USER}>`,
        to: email,
        subject: 'Reset Your Password - Aatmanirbhar Nari',
        html: emailHtml,
      });

      console.log(`[Email] Password reset email sent to ${email}`);
      return;
    } catch (error) {
      console.error('[Email Error] Failed to send email via SMTP:', error);
    }
  }

  // Development Fallback
  console.log('\n' + '='.repeat(80));
  console.log(`[DEVELOPMENT EMAIL FALLBACK]`);
  console.log(`To: ${email}`);
  console.log(`Subject: Reset Your Password - Aatmanirbhar Nari`);
  console.log(`OTP Token: ${token}`);
  console.log('='.repeat(80) + '\n');
};

module.exports = {
  sendVerificationEmail,
  sendPasswordResetEmail,
};
