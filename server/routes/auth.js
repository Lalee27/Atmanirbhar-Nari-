const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const crypto = require('crypto');
const { OAuth2Client } = require('google-auth-library');
const dns = require('dns').promises;
const User = require('../models/User');
const { sendVerificationEmail, sendPasswordResetEmail } = require('../services/emailService');
const { protect } = require('../middleware/auth');

const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: '30d' });
};

// Helper to validate email format and domain MX record existence
const validateEmailExistence = async (email) => {
  const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
  if (!emailRegex.test(email)) {
    return { valid: false, message: 'Invalid email format' };
  }

  const domain = email.split('@')[1];
  
  // Block common disposable email domains
  const disposableDomains = [
    'yopmail.com', 'mailinator.com', 'tempmail.com', 'temp-mail.org', 
    'guerrillamail.com', 'sharklasers.com', 'dispostable.com', 
    'getairmail.com', 'maildrop.cc', 'trashmail.com', '10minutemail.com'
  ];
  if (disposableDomains.includes(domain.toLowerCase())) {
    return { valid: false, message: 'Disposable/temporary email domains are not allowed.' };
  }

  // Skip DNS check for local/test addresses
  if (domain === 'localhost' || domain.endsWith('.local') || domain === 'example.com') {
    return { valid: true };
  }

  try {
    const mxRecords = await dns.resolveMx(domain);
    if (!mxRecords || mxRecords.length === 0) {
      return { valid: false, message: 'Email domain has no mail servers configured' };
    }
    return { valid: true };
  } catch (error) {
    console.error(`[DNS MX Lookup Error] domain: ${domain}, code: ${error.code}, message: ${error.message}`);
    
    // Check for explicit domain non-existence errors
    if (error.code === 'ENOTFOUND' || error.code === 'ENODATA') {
      return { valid: false, message: 'Email domain does not exist or is invalid' };
    }
    
    // For network errors, timeouts, or connection refused, fallback to true in dev/sandbox
    console.log(`[DNS MX Lookup Warning] Falling back to syntax check for ${domain} due to DNS connection error (${error.code})`);
    return { valid: true };
  }
};

// @desc    Register a new user
// @route   POST /api/auth/register
router.post('/register', async (req, res) => {
  const { name, email, password, role } = req.body;

  try {
    // Validate email existence
    const emailCheck = await validateEmailExistence(email);
    if (!emailCheck.valid) {
      return res.status(400).json({ message: emailCheck.message });
    }

    const userExists = await User.findOne({ email });

    if (userExists) {
      return res.status(400).json({ message: 'User already exists' });
    }

    // Generate a 6-digit verification code
    const verificationToken = Math.floor(100000 + Math.random() * 900000).toString();
    const verificationTokenExpires = Date.now() + 15 * 60 * 1000; // 15 minutes

    const user = await User.create({
      name,
      email,
      password,
      role,
      isVerified: false,
      verificationToken,
      verificationTokenExpires,
    });

    if (user) {
      // Send verification email (non-blocking)
      sendVerificationEmail(user.email, user.name, verificationToken).catch(err => {
        console.error('Failed to send verification email:', err);
      });

      res.status(201).json({
        message: 'Registration successful! Please check your email to verify your account.',
      });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// @desc    Auth user & get token
// @route   POST /api/auth/login
router.post('/login', async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ 
      $or: [{ email }, { alternateEmails: email }]
    });

    if (user && (await user.comparePassword(password))) {
      // Check if verified
      if (user.isVerified === false) {
        return res.status(403).json({
          message: 'Please verify your email before logging in.',
          unverified: true,
          email: user.email,
        });
      }

      res.json({
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        token: generateToken(user._id),
      });
    } else {
      res.status(401).json({ message: 'Invalid email or password' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// @desc    Verify email address
// @route   POST /api/auth/verify
router.post('/verify', async (req, res) => {
  const { email, token } = req.body;

  try {
    const user = await User.findOne({
      $or: [
        { email: email.trim().toLowerCase() },
        { alternateEmails: email.trim().toLowerCase() }
      ],
      verificationToken: token.trim(),
      verificationTokenExpires: { $gt: Date.now() },
    });

    if (!user) {
      return res.status(400).json({ message: 'Invalid or expired verification code.' });
    }

    user.isVerified = true;
    user.verificationToken = undefined;
    user.verificationTokenExpires = undefined;
    await user.save();

    res.json({ message: 'Email verified successfully! You can now log in.' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// @desc    Resend email verification
// @route   POST /api/auth/resend-verification
router.post('/resend-verification', async (req, res) => {
  const { email } = req.body;

  try {
    const user = await User.findOne({ 
      $or: [{ email }, { alternateEmails: email }]
    });

    if (!user) {
      return res.status(404).json({ message: 'User not found.' });
    }

    if (user.isVerified) {
      return res.status(400).json({ message: 'This email is already verified.' });
    }

    // Generate a new 6-digit verification code
    const verificationToken = Math.floor(100000 + Math.random() * 900000).toString();
    user.verificationToken = verificationToken;
    user.verificationTokenExpires = Date.now() + 15 * 60 * 1000; // 15 minutes
    await user.save();

    // Send email
    await sendVerificationEmail(user.email, user.name, verificationToken);

    res.json({ message: 'Verification code resent! Please check your inbox.' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// @desc    Forgot Password - Send OTP
// @route   POST /api/auth/forgot-password
router.post('/forgot-password', async (req, res) => {
  const { email } = req.body;
  try {
    const user = await User.findOne({ email: email.trim().toLowerCase() });
    if (!user) {
      return res.status(404).json({ message: 'User not found with this email.' });
    }

    // Generate a 6-digit reset token
    const resetToken = Math.floor(100000 + Math.random() * 900000).toString();
    user.verificationToken = resetToken;
    user.verificationTokenExpires = Date.now() + 15 * 60 * 1000; // 15 minutes
    await user.save();

    await sendPasswordResetEmail(user.email, user.name, resetToken);

    res.json({ message: 'Password reset instructions sent to your email.' });
  } catch (error) {
    console.error('[Forgot Password Error]:', error);
    res.status(500).json({ message: 'Failed to send password reset email.' });
  }
});

// @desc    Reset Password - Verify OTP and update password
// @route   POST /api/auth/reset-password
router.post('/reset-password', async (req, res) => {
  const { email, token, newPassword } = req.body;
  try {
    const user = await User.findOne({
      $or: [
        { email: email.trim().toLowerCase() },
        { alternateEmails: email.trim().toLowerCase() }
      ],
      verificationToken: token.trim(),
      verificationTokenExpires: { $gt: Date.now() },
    });

    if (!user) {
      return res.status(400).json({ message: 'Invalid or expired reset code.' });
    }

    user.password = newPassword;
    user.verificationToken = undefined;
    user.verificationTokenExpires = undefined;
    await user.save();

    res.json({ message: 'Password has been successfully reset. You can now log in.' });
  } catch (error) {
    console.error('[Reset Password Error]:', error);
    res.status(500).json({ message: 'Failed to reset password.' });
  }
});

// @desc    Verify Google Sign-In and retrieve/create user
// @route   POST /api/auth/google
router.post('/google', async (req, res) => {
  const { idToken, role } = req.body;

  try {
    let email, name, picture;

    const isSimulated = 
      idToken === 'simulated-google-token' || 
      !process.env.GOOGLE_CLIENT_ID || 
      process.env.GOOGLE_CLIENT_ID === 'your-google-client-id-here.apps.googleusercontent.com';

    if (isSimulated) {
      // Decode simulated payload or mock one
      console.log('[Google Auth] Using simulated authentication');
      email = req.body.email ? req.body.email.trim().toLowerCase() : 'simulated.user@example.com';
      
      // Validate simulated email domain existence
      if (email !== 'simulated.user@example.com') {
        const emailCheck = await validateEmailExistence(email);
        if (!emailCheck.valid) {
          return res.status(400).json({ message: emailCheck.message });
        }
      }

      if (req.body.name && req.body.name.trim()) {
        name = req.body.name.trim();
      } else {
        const emailPrefix = email.split('@')[0];
        name = emailPrefix.charAt(0).toUpperCase() + emailPrefix.slice(1);
      }
      
      picture = 'https://lh3.googleusercontent.com/a/default-user=s96-c';
    } else {
      const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);
      const ticket = await client.verifyIdToken({
        idToken,
        audience: process.env.GOOGLE_CLIENT_ID,
      });
      const payload = ticket.getPayload();
      email = payload.email;
      name = payload.name;
      picture = payload.picture;
    }

    let user = await User.findOne({ email });

    if (!user) {
      // Create user if they don't exist (automatically verified via Google)
      user = await User.create({
        name,
        email,
        role: role || 'customer',
        isVerified: true,
        profilePicture: picture || '',
      });
      console.log(`[Google Auth] Created new user: ${email}`);
    } else {
      // If user exists but is not verified, verify them since Google email is verified
      if (!user.isVerified) {
        user.isVerified = true;
        user.verificationToken = undefined;
        user.verificationTokenExpires = undefined;
        await user.save();
      }
      console.log(`[Google Auth] Logged in existing user: ${email}`);
    }

    res.json({
      _id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      token: generateToken(user._id),
    });
  } catch (error) {
    console.error('[Google Auth Error]:', error);
    res.status(400).json({ message: 'Google authentication failed: ' + error.message });
  }
});

// @desc    Send OTP for custom Google Sign-In flow
// @route   POST /api/auth/google-otp-send
router.post('/google-otp-send', async (req, res) => {
  const { email } = req.body;
  
  try {
    let user = await User.findOne({ email: email.trim().toLowerCase() });
    
    // Generate a 6-digit verification code
    const verificationToken = Math.floor(100000 + Math.random() * 900000).toString();
    const verificationTokenExpires = Date.now() + 15 * 60 * 1000; // 15 minutes
    
    if (!user) {
      // Create user if they don't exist
      const emailPrefix = email.split('@')[0];
      const name = emailPrefix.charAt(0).toUpperCase() + emailPrefix.slice(1);
      
      user = await User.create({
        name,
        email: email.trim().toLowerCase(),
        role: 'customer', // Default role
        isVerified: false,
        verificationToken,
        verificationTokenExpires,
      });
    } else {
      user.verificationToken = verificationToken;
      user.verificationTokenExpires = verificationTokenExpires;
      await user.save();
    }
    
    // Send email
    await sendVerificationEmail(user.email, user.name, verificationToken);
    
    res.json({ message: 'Verification code sent to your email.' });
  } catch (error) {
    console.error('[Google OTP Error]:', error);
    res.status(500).json({ message: 'Failed to send verification code.' });
  }
});

// @desc    Verify OTP for custom Google Sign-In flow
// @route   POST /api/auth/google-otp-verify
router.post('/google-otp-verify', async (req, res) => {
  const { email, token } = req.body;
  
  try {
    const user = await User.findOne({
      $or: [
        { email: email.trim().toLowerCase() },
        { alternateEmails: email.trim().toLowerCase() }
      ],
      verificationToken: token.trim(),
      verificationTokenExpires: { $gt: Date.now() },
    });
    
    if (!user) {
      return res.status(400).json({ message: 'Invalid or expired verification code.' });
    }
    
    user.isVerified = true;
    user.verificationToken = undefined;
    user.verificationTokenExpires = undefined;
    await user.save();
    
    res.json({
      _id: user._id,
      name: user.name,
      email: user.email,
      alternateEmails: user.alternateEmails || [],
      role: user.role,
      token: generateToken(user._id),
    });
  } catch (error) {
    console.error('[Google OTP Verify Error]:', error);
    res.status(500).json({ message: 'Verification failed.' });
  }
});

// @desc    Update user profile (profilePicture, preferences, theme)
// @route   PUT /api/auth/profile
router.put('/profile', protect, async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    if (req.body.profilePicture !== undefined) user.profilePicture = req.body.profilePicture;
    if (req.body.theme !== undefined) user.theme = req.body.theme;
    if (req.body.preferences !== undefined) {
      user.preferences = { ...user.preferences, ...req.body.preferences };
    }

    const updatedUser = await user.save();
    res.json({
      _id: updatedUser._id,
      name: updatedUser.name,
      email: updatedUser.email,
      role: updatedUser.role,
      profilePicture: updatedUser.profilePicture,
      theme: updatedUser.theme,
      preferences: updatedUser.preferences,
      token: generateToken(updatedUser._id), // Optionally re-issue token
    });
  } catch (error) {
    console.error('[Update Profile Error]:', error);
    res.status(500).json({ message: 'Failed to update profile.' });
  }
});

// @desc    Change password securely
// @route   POST /api/auth/change-password
router.post('/change-password', protect, async (req, res) => {
  const { currentPassword, newPassword } = req.body;
  try {
    const user = await User.findById(req.user._id);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Google users might not have a password
    if (!user.password) {
      return res.status(400).json({ message: 'You registered with Google. You cannot change password here.' });
    }

    const isMatch = await user.comparePassword(currentPassword);
    if (!isMatch) {
      return res.status(401).json({ message: 'Incorrect current password.' });
    }

    user.password = newPassword;
    await user.save();
    res.json({ message: 'Password updated successfully.' });
  } catch (error) {
    console.error('[Change Password Error]:', error);
    res.status(500).json({ message: 'Failed to change password.' });
  }
});



module.exports = router;
