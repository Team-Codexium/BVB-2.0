import { sendEmail } from './sendemail.js';

// Test email sending
const testEmail = async () => {
  try {
    const result = await sendEmail(
      'test@example.com', // Replace with your test email
      'Test Email - BarsVsBars',
      `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #dc2626; text-align: center;">🎤 BarsVsBars Test Email</h2>
          <div style="background-color: #f8f9fa; padding: 20px; border-radius: 8px; margin: 20px 0;">
            <p style="margin: 0 0 15px 0; font-size: 16px;">Hello!</p>
            <p style="margin: 0 0 15px 0; font-size: 16px;">This is a test email to verify the email system is working.</p>
            <div style="background-color: #dc2626; color: white; padding: 15px; border-radius: 8px; text-align: center; margin: 20px 0;">
              <h1 style="margin: 0; font-size: 32px; letter-spacing: 5px;">123456</h1>
            </div>
            <p style="margin: 0; font-size: 14px; color: #666;">If you received this email, the email system is working correctly!</p>
          </div>
          <p style="text-align: center; color: #666; font-size: 12px;">
            🎤 Stay lyrical,<br>BarsVsBars Team
          </p>
        </div>
      `
    );
    
    console.log('Email test result:', result);
  } catch (error) {
    console.error('Email test failed:', error);
  }
};

// Run the test
testEmail(); 