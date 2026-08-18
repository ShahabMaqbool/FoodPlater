
# FoodPlater – Make Your Own Plater

FoodPlater is a full-stack food platter management/admin dashboard built with **React**, **Node.js**, **Express.js**, and **PostgreSQL**.

The project provides an admin interface for managing customers, menu items, categories, orders, and account/profile security.

## Features

### Authentication & Authorization
- Admin registration
- Admin login
- Password hashing with bcrypt
- JWT-based authentication
- Protected routes
- Role-based admin authorization

### Dashboard
- Admin dashboard interface
- Navigation sidebar
- Dashboard header
- Management sections for the main FoodPlater modules

### Customers
- View customers
- Add customers
- Update customers
- Delete customers
- Customer search/filter interface
- Order count per customer
- Customer statistics

### Menu Items
- Create menu items
- View menu items
- Update menu items
- Delete menu items
- Menu item/category management

### Categories
- Create categories
- View categories
- Update categories
- Delete categories

### Orders
- Order management
- Customer-linked orders
- Order status
- Order amount and item information

### Admin Profile
- View admin profile
- Update personal information
- Change password
- Password validation
- Profile image selection
- Account security section
- Two-Factor Authentication status toggle
- Last login information
- Login activity history

### Security
- JWT authentication
- bcrypt password hashing
- Protected API routes
- Admin role middleware
- Last login tracking
- Login activity tracking
- Two-factor authentication status stored in PostgreSQL

## Tech Stack

### Frontend
- React
- JavaScript
- CSS
- Vite
- Iconify
- SweetAlert2

### Backend
- Node.js
- Express.js
- JWT
- bcrypt
- CORS
- dotenv

### Database
- PostgreSQL
- pgAdmin

## Project Structure

```text
FoodPlater/
├── backend/
│   ├── config/
│   │   └── db.js
│   ├── controllers/
│   │   ├── authController.js
│   │   ├── userController.js
│   │   └── ...
│   ├── middleware/
│   │   ├── authMiddleware.js
│   │   ├── roleMiddleware.js
│   │   └── ...
│   ├── models/
│   │   ├── userModel.js
│   │   └── ...
│   ├── routes/
│   │   ├── authRoutes.js
│   │   ├── userRoutes.js
│   │   └── ...
│   ├── .env
│   ├── package.json
│   └── server.js
│
├── frontend/
│   └── src/
│       ├── components/
│       ├── pages/
│       ├── styles/
│       └── ...
│
└── .gitignore
```

## Backend API

### Authentication

| Method | Endpoint | Description |
|---|---|---|
| POST | `/api/auth/register` | Register admin |
| POST | `/api/auth/login` | Login admin |

### User/Profile

| Method | Endpoint | Description |
|---|---|---|
| GET | `/api/users/profile` | Get admin profile |
| PUT | `/api/users/profile` | Update admin profile |
| PUT | `/api/users/change-password` | Change password |
| GET | `/api/users/security` | Get account security information |
| GET | `/api/users/login-activity` | Get login activity |
| PUT | `/api/users/two-factor` | Enable/disable 2FA |

### Other Modules

| Module | Base Endpoint |
|---|---|
| Dashboard | `/api/dashboard` |
| Orders | `/api/orders` |
| Menu Items | `/api/menu-items` |
| Categories | `/api/categories` |
| Customers | `/api/customers` |

## Database

The application uses PostgreSQL.

Important tables include:

- `users`
- `customers`
- `orders`
- `menu_items`
- `categories`
- `login_activity`

The `users` table contains account and security information such as:

- name
- email
- password
- role
- phone
- location
- created date
- two-factor authentication status
- last login

The `login_activity` table stores successful login records including:

- user ID
- login time
- IP address
- user agent

## Environment Variables

Create a `.env` file inside the `backend` folder.

Example:

```env
PORT=5000
DB_HOST=localhost
DB_PORT=5432
DB_NAME=your_database_name
DB_USER=your_postgres_user
DB_PASSWORD=your_postgres_password
JWT_SECRET=your_secret_key
```

**Do not upload `.env` to GitHub.**

The project `.gitignore` already ignores:

```text
node_modules/
.env
dist/
build/
```

## Installation

Clone the repository:

```bash
git clone https://github.com/ShahabMaqbool/FoodPlater.git
cd FoodPlater
```

### Backend

```bash
cd backend
npm install
node server.js
```

The backend runs on:

```text
http://localhost:5000
```

### Frontend

Open another terminal:

```bash
cd frontend
npm install
npm run dev
```

Then open the local URL shown by Vite.

## Authentication Flow

```text
Admin
  ↓
Register / Login
  ↓
bcrypt password verification
  ↓
JWT token generated
  ↓
Token stored on frontend
  ↓
Protected API request
  ↓
JWT verification middleware
  ↓
Admin role verification
  ↓
Controller
  ↓
PostgreSQL
```

## Account Security Flow

```text
Successful Login
      ↓
Update users.last_login
      ↓
Create login_activity record
      ↓
Profile → Account Security
      ↓
Last Login
      +
Login Activity
```

Two-Factor Authentication is stored in the `users.two_factor_enabled` field and can be updated through the protected API.

## Development Notes

- The backend follows a controller/model/routes structure.
- Authentication uses JWT.
- Passwords are stored as bcrypt hashes.
- Admin-only routes use authentication and role middleware.
- PostgreSQL is used as the main database.
- Sensitive environment variables are excluded from Git.

## Author

**Shahab Maqbool**

FoodPlater – Make Your Own Plater
