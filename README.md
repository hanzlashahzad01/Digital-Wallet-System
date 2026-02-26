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

## ScreenShots

## Register Page

<img width="1915" height="1030" alt="register" src="https://github.com/user-attachments/assets/64ebc6da-dcca-4efc-9386-2aa8ca4e80ae" />

## Login Page

<img width="1915" height="1035" alt="login" src="https://github.com/user-attachments/assets/a8e02007-9346-4151-afa5-9fd0c1ab8ce9" />

## DashBoard

<img width="1914" height="1033" alt="d" src="https://github.com/user-attachments/assets/def689e6-a591-4034-8157-85737e842a0b" />

<img width="1915" height="1027" alt="d1" src="https://github.com/user-attachments/assets/da5a1144-1eec-4826-954d-0c58e0a3fa43" />

## Send Money Page

<img width="1916" height="1031" alt="send m" src="https://github.com/user-attachments/assets/75fc6734-d097-4bcc-b97b-fb54c74bfe9a" />

<img width="1915" height="1034" alt="c" src="https://github.com/user-attachments/assets/ec38c39f-4ec2-44af-9fb6-b85a4320525d" />

<img width="1914" height="1031" alt="t" src="https://github.com/user-attachments/assets/d80e689b-46c1-42a7-8504-16e9047a413b" />

## History Page

<img width="1917" height="1031" alt="history" src="https://github.com/user-attachments/assets/bb6cee85-4fdf-4d05-b971-88b51737099b" />


<img width="1914" height="1033" alt="n" src="https://github.com/user-attachments/assets/f66c30ff-9a46-4d64-947a-d28adea31991" />

## Profile Page

<img width="1916" height="1032" alt="p" src="https://github.com/user-attachments/assets/0b0789cb-bd4b-4fcf-9937-b47bdd764aee" />


## 📬 Connect with Me
I'm always open to discussing new projects, creative ideas, or opportunities to be part of your visions.

Email: hanzlashahzadhanzlashahzad@gmail.com

LinkedIn: https://www.linkedin.com/in/hanzla-shahzad

GitHub: @hanzlashahzad01

## Guidance about this website 

- **Problem:** Email OTP aksar late ho jata tha.
- **Solution:** Ab OTP simulation mode mein hai. Code aapko **Server Console** mein nazar ayega.
- **Setup:** `Register` page par ja kar apna mobile number (+92... format) ke sath enter karein. 
- **Transfer:** Paise bhejte waqt code console se dekh kar enter karein.
- **Security:** Agar aap 3 baar galat code enter karein ge to wallet freeze ho jaye ga.

---

## 📄 License
This project is for development and educational purposes.
