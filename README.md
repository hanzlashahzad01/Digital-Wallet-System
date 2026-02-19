# 🌐 Flux - Premium Digital Wallet & Fintech System

Flux is a high-performance, secure, and visually stunning digital wallet platform. It features real-time transactions, multi-layer security, and a premium "glassmorphism" design system.

---

## ✨ Features

- **🚀 Instant Transfers**: Send money to any user via Email or Wallet ID.
- **🛡️ Multi-Layer Security**: 
  - JWT Authentication for secure sessions.
  - SMS/Console OTP verification for every transaction.
  - Real-time Fraud Detection system with automated risk scoring.
- **📱 Responsive Design**: A state-of-the-art UI built for both desktop and mobile connectivity.
- **📊 Financial Analytics**: Dynamic spending and income charts to track your activity.
- **🛡️ Admin Dashboard**: Monitor global transactions, review flagged high-risk activity, and manage user wallet states (freeze/unfreeze).

---

## 🛠️ Technology Stack

- **Frontend**: React.js, Tailwind CSS, Lucide Icons, Chart.js.
- **Backend**: Node.js, Express.js.
- **Database**: MongoDB (Mongoose).
- **Security**: JWT (JSON Web Tokens), Bcrypt.js, OTP verification.

---

## 🚀 Getting Started

### 📦 Prerequisites
- Node.js installed.
- MongoDB running locally or a MongoDB Atlas URI.

### 🔧 Installation

1. **Clone and Install Backend:**
   ```bash
   cd server
   npm install
   ```

2. **Configure Environment:**
   Create a `.env` file in the `server` directory:
   ```env
   MONGO_URL=your_mongodb_uri
   PORT=3001
   JWT_SECRET=your_secret_key
   ```

3. **Clone and Install Frontend:**
   ```bash
   cd client
   npm install
   ```

4. **Run the Application:**
   - **Server**: `cd server && npm start`
   - **Client**: `cd client && npm run dev`

---

## 📱 SMS & OTP Verification

The system includes a verification layer for all transfers. 

### 🛠️ Simulation Mode (Default)
By default, the system is in **Simulation Mode**. No actual SMS will be sent. 
- When you request an OTP during a transfer, check your **Backend Terminal/Console**.
- Look for a message like: `[SMS SIMULATION] To: +92... | Message: Your verification code is: 123456`.
- Use this 6-digit code in the UI to authorize your transfer.

### 🌐 Real SMS Setup (Twilio)
To enable real SMS notifications:
1. Update `server/utils/smsService.js` to enable the Twilio client.
2. Add your credentials to `server/.env`:
   ```env
   TWILIO_ACCOUNT_SID=your_sid
   TWILIO_AUTH_TOKEN=your_token
   TWILIO_PHONE_NUMBER=your_number
   ```

---

## 📖 Walkthrough

1. **Register**: Create an account. Note that each new account starts with a test balance.
2. **Dashboard**: View your Wallet ID and recent activity.
3. **Send Money**: Use a recipient's Wallet ID or Email.
4. **Authorize**: Enter the OTP found in the server console to complete the transfer.
5. **Admin**: Flagged transactions (High risk > 10,000 Rs or frequent transfers) will appear in the Admin panel.

---

## 🇵🇰 Urdu Guide (Mukhtasir)

- **Problem:** Email OTP aksar late ho jata tha.
- **Solution:** Ab OTP simulation mode mein hai. Code aapko **Server Console** mein nazar ayega.
- **Setup:** `Register` page par ja kar apna mobile number (+92... format) ke sath enter karein. 
- **Transfer:** Paise bhejte waqt code console se dekh kar enter karein.
- **Security:** Agar aap 3 baar galat code enter karein ge to wallet freeze ho jaye ga.

---

## 📄 License
This project is for development and educational purposes.
