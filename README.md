# 🔮 KuromiTask Backend - Server & API Gateway

The robust server-side architecture powering the KuromiTask application. This backend manages authentication, database operations, and secure business logic.

## 🚀 Key Responsibilities

- **Authentication System**
  - Secure JWT generation and cookie-based management
  - Secure password hashing using bcrypt
  - Dynamic OTP generation and transaction lifecycle management

- **Task & Category APIs**
  - Fully structured RESTful endpoints for CRUD operations
  - Embedded relational model managing subtasks under parent categories

- **Email Services**
  - Integrated Nodemailer transport layer for handling reliable user verification emails

## 🛠️ System Architecture & Tech Stack

- **Runtime Environment:** Node.js
- **Framework:** Express.js (configured for Serverless deployment)
- **Database Layer:** MongoDB Atlas via Mongoose ODM
- **Security & Utilities:** `jsonwebtoken`, `bcryptjs`, `cookie-parser`, `cors`
- **Hosting Engine:** Vercel (Serverless Functions via `vercel.json`)

## 📋 Environment Configuration

To run this backend locally, create a `.env` file in the root directory and define the following variables:

```env
PORT=5000
DB_URI=your_mongodb_connection_string
JWT_SECRET=your_super_secret_jwt_key
EMAIL_USER=your_gmail_address
EMAIL_PASS=your_gmail_app_password
FRONTEND_URL=http://localhost:5173

## 📦 Local Installation

```bash
# Clone the backend repository
git clone [https://github.com/amna-tech-hub/kuromi-backend.git](https://github.com/amna-tech-hub/kuromi-backend.git)

# Navigate into the project folder
cd kuromi-backend

# Install necessary modules
npm install

# Run the development server
npm run dev