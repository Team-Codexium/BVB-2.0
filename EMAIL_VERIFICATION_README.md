# Email OTP Verification System

This document describes the email OTP verification system implemented in the BarsVsBars application.

## Overview

The email verification system ensures that users verify their email addresses before completing registration. It uses a 6-digit OTP (One-Time Password) that is sent to the user's email address and expires after 10 minutes.

## Features

- **6-digit OTP generation**: Random 6-digit codes are generated for each verification request
- **10-minute expiration**: OTPs expire after 10 minutes for security
- **Resend functionality**: Users can request new OTPs with a 60-second cooldown
- **Email verification required**: Registration is blocked until email is verified
- **Beautiful email templates**: Professional HTML email templates with branding
- **Auto-focus OTP inputs**: Smooth user experience with auto-focus and navigation

## Backend Implementation

### Models

#### EmailVerification Model (`backend/models/emailVerification.model.js`)
```javascript
{
  email: String (required, unique),
  otp: String (required),
  expiresAt: Date (required),
  verified: Boolean (default: false),
  timestamps: true
}
```

### Controllers

#### EmailVerification Controller (`backend/controllers/emailVerification.controller.js`)

**Endpoints:**
- `POST /api/email-verification/send-otp` - Send OTP to email
- `POST /api/email-verification/verify-otp` - Verify OTP
- `POST /api/email-verification/resend-otp` - Resend OTP
- `GET /api/email-verification/check/:email` - Check verification status

### Routes

#### EmailVerification Routes (`backend/routes/emailVerification.route.js`)
All email verification endpoints are mounted at `/api/email-verification`

## Frontend Implementation

### Components

#### EmailVerification Component (`frontend/src/components/EmailVerification.jsx`)
- 6-digit OTP input with auto-focus
- Real-time validation
- Resend functionality with countdown timer
- Error and success handling
- Responsive design

#### EmailVerificationPage Component (`frontend/src/pages/EmailVerificationPage.jsx`)
- Standalone email verification page
- Can be accessed directly via URL
- Supports email parameter in URL

### Context Integration

#### AuthContext Updates (`frontend/src/contexts/AuthContext.jsx`)
Added email verification methods:
- `sendOTP(email)`
- `verifyOTP(email, otp)`
- `resendOTP(email)`
- `checkEmailVerification(email)`

### Registration Flow

#### Updated Register Component (`frontend/src/pages/Register.jsx`)
- Email verification button next to email input
- Two-step registration process (email verification → registration)
- Integration with email verification component
- Link to standalone verification page

## Email Templates

The system uses beautiful HTML email templates with:
- BarsVsBars branding and colors
- Professional styling
- Clear OTP display
- Expiration information
- Security notices

## Security Features

1. **OTP Expiration**: 10-minute expiration prevents long-term code reuse
2. **Rate Limiting**: 60-second cooldown for resend requests
3. **Unique OTPs**: Each request generates a new random OTP
4. **Email Verification Required**: Registration blocked until email verified
5. **Secure Storage**: OTPs stored securely in database with expiration

## Usage

### For Users

1. **During Registration**:
   - Enter email address
   - Click "Verify" button
   - Check email for 6-digit code
   - Enter code in verification screen
   - Complete registration

2. **Standalone Verification**:
   - Visit `/email-verification`
   - Enter email address
   - Follow verification process
   - Redirected to registration with verified email

### For Developers

#### Testing Email System
```bash
# Run the test script (update email address first)
node backend/test-email.js
```

#### API Endpoints
```bash
# Send OTP
POST /api/email-verification/send-otp
Body: { "email": "user@example.com" }

# Verify OTP
POST /api/email-verification/verify-otp
Body: { "email": "user@example.com", "otp": "123456" }

# Resend OTP
POST /api/email-verification/resend-otp
Body: { "email": "user@example.com" }

# Check verification status
GET /api/email-verification/check/user@example.com
```

## Environment Variables

Make sure these environment variables are set in your `.env` file:

```env
BVB_EMAIL=your-email@gmail.com
BVB_PASS=your-app-password
```

## Error Handling

The system handles various error scenarios:
- Invalid email format
- Email already verified
- OTP expired
- Invalid OTP
- Network errors
- Email sending failures

## Future Enhancements

Potential improvements:
- SMS verification as alternative
- Email verification for password reset
- Two-factor authentication
- Email verification for profile changes
- Admin email verification management

## Troubleshooting

### Common Issues

1. **Email not sending**: Check Gmail app password and environment variables
2. **OTP not working**: Verify OTP hasn't expired (10 minutes)
3. **Registration blocked**: Ensure email is verified before registration
4. **Resend not working**: Wait for 60-second cooldown to complete

### Debug Steps

1. Check server logs for email sending errors
2. Verify database connection and EmailVerification model
3. Test email functionality with test script
4. Check frontend console for API errors
5. Verify environment variables are set correctly 