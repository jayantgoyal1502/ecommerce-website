# Jayant Bangles Ecommerce Website

A modern, full-stack ecommerce platform for **Jayant Bangles**, built with the **MERN stack (MongoDB, Express, React, Node.js)** and **Vite**.

---

## 🚀 Features

- ✅ User authentication (register, login, logout)
- 🛍️ Product catalog with categories and subcategories
- 🛒 Shopping cart and wishlist
- 📦 Order placement and order history
- 🔐 Admin dashboard for managing products, categories, and orders
- ⭐ Product reviews (only by verified buyers)
- 📱 Responsive design for mobile and desktop
- 🔐 Secure API with JWT authentication
- 🖼️ Image upload for products
- 💳 Payment integration (Razorpay)
- 🆕 "New Arrivals" section (shows products added in the last 14 days)

---

## 🛠️ Tech Stack

- **Frontend:** React, Vite, Tailwind CSS
- **Backend:** Node.js, Express.js
- **Database:** MongoDB (Atlas)
- **Authentication:** JWT
- **Payment Gateway:** Razorpay

---

## ⚙️ Getting Started

### 📦 Prerequisites

- [Node.js](https://nodejs.org/) (v18+ recommended)
- npm
- [MongoDB Atlas](https://www.mongodb.com/cloud/atlas) account (or local MongoDB)
- (Optional) [Razorpay](https://razorpay.com/) account for payments

---

## 📥 Installation

### 1. Clone the repository

```bash
git clone https://github.com/yourusername/ecommerce-website.git
cd ecommerce-website
```

### 2. Install frontend dependencies

```bash
npm install
```

### 3. Install backend dependencies

```bash
cd backend
npm install
cd ..
```

---

## 🔐 Environment Variables

Create a `.env` file **inside the `backend/` directory** with the following:

```env
PORT=5050
MONGODB_URI=your_mongodb_atlas_uri
JWT_SECRET=your_jwt_secret
RAZORPAY_KEY_ID=your_razorpay_key_id
RAZORPAY_KEY_SECRET=your_razorpay_key_secret
```

---

## 🧪 Running Locally

### Start the **backend**:

```bash
cd backend
npm start
```

### Start the **frontend**:

```bash
npm run dev
```

- Frontend: [http://localhost:5173](http://localhost:5173)
- Backend API: [http://localhost:5050](http://localhost:5050)

---

## 📦 Build for Production

```bash
npm run build
```

- The production-ready frontend will be in the `dist/` folder.

---

## 🚀 Deployment

- Deploy backend & frontend using:
  - [Render](https://render.com/)
  - [Railway](https://railway.app/)
  - [Vercel](https://vercel.com/) / [Netlify](https://netlify.com/) for frontend
- Make sure to:
  - Set the environment variables in your deployment provider
  - Point your domain to the deployed frontend

---

## 📬 Contact

**Jayant Goyal**  
📧 jayantgoyal500@gmail.com  
🌐 [LinkedIn](https://www.linkedin.com/in/jayantgoyal2002) **

---

