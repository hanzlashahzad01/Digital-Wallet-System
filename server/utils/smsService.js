import twilio from 'twilio';

const accountSid = process.env.TWILIO_ACCOUNT_SID;
const authToken = process.env.TWILIO_AUTH_TOKEN;
const fromPhone = process.env.TWILIO_PHONE_NUMBER;

// Initialize Twilio client disabled to force console simulation
let client = null;
/*
if (accountSid && authToken) {
    client = twilio(accountSid, authToken);
}
*/

/**
 * Send SMS OTP
 * @param {string} phoneNumber - Recipient's phone number (with country code)
 * @param {string} otp - The 6-digit verification code
 */
export const sendSMSOTP = async (phoneNumber, otp) => {
    try {
        if (!client) {
            console.log(`[SMS SIMULATION] To: ${phoneNumber} | Message: Your Digital Wallet verification code is: ${otp}. Valid for 5 minutes.`);
            return { success: true, simulated: true };
        }

        const message = await client.messages.create({
            body: `Your Digital Wallet verification code is: ${otp}. Valid for 5 minutes. Do not share this code with anyone.`,
            from: fromPhone,
            to: phoneNumber
        });

        console.log(`✅ SMS OTP sent to ${phoneNumber}: ${message.sid}`);
        return { success: true, sid: message.sid };
    } catch (error) {
        console.error('❌ SMS sending failed:', error);
        throw new Error('Failed to send SMS verification code');
    }
};

/**
 * Send Transaction Notification SMS
 * @param {string} phoneNumber - Recipient's phone number
 * @param {string} type - 'sent' or 'received'
 * @param {number} amount - Transaction amount
 */
export const sendTransactionSMS = async (phoneNumber, type, amount) => {
    try {
        if (!client) {
            console.log(`[SMS SIMULATION] To: ${phoneNumber} | Message: Digital Wallet: You have ${type} Rs. ${amount.toLocaleString()}.`);
            return;
        }

        const isSent = type === 'sent';
        const body = isSent
            ? `Digital Wallet: Rs. ${amount.toLocaleString()} has been sent from your account. If this was not you, contact support immediately.`
            : `Digital Wallet: You have received Rs. ${amount.toLocaleString()} in your account.`;

        await client.messages.create({
            body,
            from: fromPhone,
            to: phoneNumber
        });

        console.log(`✅ Transaction notification SMS sent to ${phoneNumber}`);
    } catch (error) {
        console.error('❌ Transaction SMS failed:', error);
    }
};
