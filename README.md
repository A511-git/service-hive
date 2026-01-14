# GigFlow — Full Stack

GigFlow is a mini freelance marketplace platform where:
- **Clients** can post jobs (**Gigs**)
- **Freelancers** can apply by submitting **Bids**
- Clients can **hire one freelancer** and the system automatically **rejects other bids**

This project is designed to demonstrate:
✅ database relationships  
✅ secure authentication  
✅ role-free design (any user can be client or freelancer)  
✅ hiring logic with atomic updates / transactions  

---

## 📌 Project Overview

**GigFlow** is a mini freelance marketplace platform.

### Core Goal
- Public listing of open gigs
- Logged-in users can post gigs
- Logged-in users can bid on gigs
- Gig owner can view bids and hire a bid

---

## 🧩 Technical Stack

### Frontend
- **React.js + Vite**
- **PrimeReact + PrimeFlex**
- **Tailwind**
- Axios
- React Router
- Context API for state management

### Backend
- Node.js
- Express.js (**Express v5**)
- MongoDB Atlas
- Mongoose
- Zod validation

### Authentication
- JWT Access Token stored on client
- Refresh Token stored in **HttpOnly cookie**
- Axios interceptor for automatic refresh + retry

---

## ✅ Features Implemented

### A) User Authentication
- Secure Signup/Login
- JWT-based authentication
- Refresh flow (`/api/auth/refresh`)
- Roles are fluid:
  - Any user can post gigs (client)
  - Any user can bid (freelancer)

---

### B) Gig Management (CRUD)
✅ Browse Open Gigs (public feed)  
✅ Search gigs by title  
✅ Pagination support  
✅ Create Gig for logged-in users  

---

### C) Hiring Logic (Crucial)
#### 1. Bidding
Freelancers submit bids:
- `message`
- `price`

#### 2. Review
Gig owner can see all bids received for their gig.

#### 3. Hiring
Gig owner can hire one bid.

Hiring logic:
- Gig status changes: `open → assigned`
- Selected bid status: `pending → hired`
- Other bids for same gig: `pending → rejected`

✅ Implemented using MongoDB transaction-based secure logic.

---

## 🏗 API Architecture

### Auth
| Method | Endpoint | Description |
|------:|----------|-------------|
| POST | `/api/auth/register` | Register new user |
| POST | `/api/auth/login` | Login & set HttpOnly cookie |
| GET | `/api/auth/refresh` | Issue new access token |
| GET | `/api/auth/me` | Get logged-in user |

### Gigs
| Method | Endpoint | Description |
|------:|----------|-------------|
| GET | `/api/gigs` | Fetch open gigs (pagination + search) |
| POST | `/api/gigs` | Create a gig (logged-in user) |

### Bids
| Method | Endpoint | Description |
|------:|----------|-------------|
| POST | `/api/bids` | Submit bid (logged-in user) |
| GET | `/api/bids/:gigId` | Fetch bids for gig (owner only) |
| PATCH | `/api/bids/:bidId/hire` | Hire bid (atomic) |

---

## 🗄 Database Schema

### User
- `name`
- `email`
- `password`

### Gig
- `title`
- `description`
- `budget`
- `clientId`
- `status`: `open | assigned`

### Bid
- `gigId`
- `freelancerId`
- `message`
- `price`
- `status`: `pending | hired | rejected`

---

## ⭐ Bonus Implemented

### ✅ Bonus 1: Transactional Integrity (Race Condition Protection)

Hiring logic is implemented using **MongoDB Transactions** in the backend:

- Only one bid can be hired per gig
- If 2 hire actions happen at same time:
  ✅ one transaction wins  
  ✅ other fails safely  
  ✅ no double-hiring  

---

### ❌ Bonus 2: Real-time Updates (Socket.io)

Socket.io real-time notifications are not implemented yet.

Planned flow:
- On hire → notify freelancer instantly:  
  `"You have been hired for [Gig Title]!"`

---

## 🌍 Deployment

### Live Links
- **Frontend:** https://mohammad-atif-service-hive.vercel.app  
---

## ⚙️ Environment Setup

### Backend `.env.example`
Create file: `backend/.env.example`

```env
PORT=8001
DB_URI=mongodb+srv://<username>:<password>@cluster.mongodb.net/servicehive

ACCESS_TOKEN_SECRET=your_access_secret
REFRESH_TOKEN_SECRET=your_refresh_secret
ACCESS_TOKEN_EXPIRY=15m
REFRESH_TOKEN_EXPIRY=30d

FRONTEND_URL=http://localhost:5173
NODE_ENV=development
```

### Frontend `.env.example`
Create file: `frontend/.env.example`

```env
VITE_API_BASE_URL=http://localhost:8001
```

---

## 🧪 Run Locally

### Backend
```bash
cd backend
npm install
npm run dev
```

Backend runs at:
`http://localhost:8001`

---

### Frontend
```bash
cd frontend
npm install
npm run dev
```

Frontend runs at:
`http://localhost:5173`

---

## 🎥 Demo / Loom Video

A short walkthrough video should demonstrate:
✅ Login/Register  
✅ Browse gigs  
✅ Post gig  
✅ Submit bid  
✅ View bids (owner only)  
✅ Hire bid flow  

---
## 👤 Author

**Mohammad Atif (A-511)**  
GitHub: https://github.com/A511-git
