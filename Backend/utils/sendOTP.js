const twilio = require('twilio');
const sendEmail = require('./sendEmail');

/**
 * Send OTP via SMS using Twilio
 * @param {string} mobile - Mobile number to send OTP to
 * @param {string} otp - OTP code to send
 * @returns {Promise} Promise with Twilio message response
 */
const sendSmsOTP = async (mobile, otp) => {
  try {
    const client = twilio(
      process.env.TWILIO_ACCOUNT_SID,
      process.env.TWILIO_AUTH_TOKEN
    );

    const message = await client.messages.create({
      body: `Your XO Sports Hub verification code is: ${otp}. Valid for 10 minutes.`,
      from: process.env.TWILIO_PHONE_NUMBER,
      to: mobile
    });

    return message;
  } catch (error) {
    console.error('Error sending SMS OTP:', error);
    throw new Error('Failed to send SMS OTP');
  }
};

/**
 * Send OTP via Email using Nodemailer
 * @param {string} email - Email address to send OTP to
 * @param {string} otp - OTP code to send
 * @returns {Promise} Promise with email send response
 */
const sendEmailOTP = async (email, otp) => {
  try {
    await sendEmail({
      email,
      subject: 'Your XO Sports Hub Verification Code',
      message: `Your verification code is: ${otp}. This code is valid for 10 minutes.`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #333;">XO Sports Hub Verification</h2>
          <p>Your verification code is:</p>
          <div style="background-color: #f4f4f4; padding: 15px; text-align: center; font-size: 24px; letter-spacing: 5px; font-weight: bold;">
            ${otp}
          </div>
          <p>This code is valid for 10 minutes.</p>
          <p>If you didn't request this code, please ignore this email.</p>
        </div>
      `
    });

    return true;
  } catch (error) {
    console.error('Error sending Email OTP:', error);
    throw new Error('Failed to send Email OTP');
  }
};

/**
 * Send OTP via both SMS and Email
 * @param {Object} user - User object with mobile and email
 * @param {string} otp - OTP code to send
 * @returns {Promise} Promise with combined results
 */
const sendOTP = async (user, otp) => {
  const results = {
    sms: null,
    email: null,
    success: false
  };

  try {
    // Send SMS OTP
    if (user.mobile) {
      results.sms = await sendSmsOTP(user.mobile, otp);
    }

    // Send Email OTP
    if (user.email) {
      results.email = await sendEmailOTP(user.email, otp);
    }

    // If at least one method succeeded
    results.success = !!(results.sms || results.email);
    
    return results;
  } catch (error) {
    console.error('Error sending OTP:', error);
    throw new Error('Failed to send OTP');
  }
};

module.exports = {
  sendOTP,
  sendSmsOTP,
  sendEmailOTP
};
