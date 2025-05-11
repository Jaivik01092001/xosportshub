# XO Sports Hub - Sports Training Marketplace Backend

A complete backend system for a digital content marketplace platform for sports training, built with Node.js, Express.js, and MongoDB.

## Features

- **Authentication System**: JWT-based authentication with user roles (admin, seller, buyer)
- **User Management**: Registration, profile management, seller verification
- **Content Management**: Upload, manage, and sell digital content (videos, PDFs, etc.)
- **Order System**: Process purchases with invoices and download permissions
- **Bidding System**: Support for auction-based content sales
- **Custom Requests**: Allow buyers to request custom content from sellers
- **Payment Integration**: Stripe integration for payments and seller payouts
- **Notification System**: Email and in-app notifications
- **CMS**: Admin-managed content pages and contact form
- **Settings**: Platform configuration for admins

## Tech Stack

- **Node.js & Express.js**: Server and API framework
- **MongoDB & Mongoose**: Database and ODM
- **JWT**: Authentication
- **Multer**: File uploads (with AWS S3 integration)
- **Stripe**: Payment processing
- **Nodemailer**: Email notifications
- **Express Validator**: Input validation
- **Helmet & CORS**: Security middleware
- **PDFKit**: Invoice generation

## Getting Started

### Prerequisites

- Node.js (v14+)
- MongoDB
- Stripe account (for payments)
- AWS S3 bucket (for file storage in production)

### Installation

1. Clone the repository:
   ```
   git clone https://github.com/yourusername/xosportshub.git
   cd xosportshub
   ```

2. Install dependencies:
   ```
   npm install
   ```

3. Set up environment variables:
   - Copy `.env.example` to `.env`
   - Update the variables with your configuration

4. Start the development server:
   ```
   npm run dev
   ```

### Database Seeding

To seed the database with sample data:

```
npm run seed
```

To remove all data:

```
npm run seed -- -d
```

## API Documentation

### Authentication Routes

- `POST /api/auth/register` - Register a new user
- `POST /api/auth/login` - Login user
- `GET /api/auth/me` - Get current user
- `GET /api/auth/logout` - Logout user
- `POST /api/auth/forgot-password` - Request password reset
- `PUT /api/auth/reset-password/:token` - Reset password
- `PUT /api/auth/update-password` - Update password
- `GET /api/auth/verify-email/:token` - Verify email

### User Routes

- `GET /api/users` - Get all users (admin)
- `GET /api/users/:id` - Get single user (admin)
- `POST /api/users` - Create user (admin)
- `PUT /api/users/:id` - Update user (admin)
- `DELETE /api/users/:id` - Delete user (admin)
- `PUT /api/users/profile` - Update user profile
- `GET /api/users/sellers/:id` - Get seller profile
- `PUT /api/users/verify-seller/:id` - Verify seller (admin)

### Content Routes

- `GET /api/content` - Get all content
- `GET /api/content/:id` - Get single content
- `POST /api/content` - Create content (seller)
- `PUT /api/content/:id` - Update content (seller)
- `DELETE /api/content/:id` - Delete content (seller)
- `GET /api/content/seller/me` - Get seller content
- `POST /api/content/upload` - Upload content file

### Order Routes

- `GET /api/orders` - Get all orders (admin)
- `GET /api/orders/:id` - Get single order
- `POST /api/orders` - Create order (buyer)
- `PUT /api/orders/:id` - Update order status (admin)
- `GET /api/orders/buyer` - Get buyer orders
- `GET /api/orders/seller` - Get seller orders
- `GET /api/orders/:id/download` - Download content (buyer)

### Bid Routes

- `GET /api/bids` - Get all bids (admin)
- `GET /api/bids/:id` - Get single bid
- `POST /api/bids` - Create bid (buyer)
- `PUT /api/bids/:id/cancel` - Cancel bid (buyer)
- `GET /api/bids/content/:contentId` - Get bids for content
- `GET /api/bids/user` - Get user bids
- `PUT /api/bids/end-auction/:contentId` - End auction (seller)

### Custom Request Routes

- `GET /api/requests` - Get all requests (admin)
- `GET /api/requests/:id` - Get single request
- `POST /api/requests` - Create request (buyer)
- `PUT /api/requests/:id/respond` - Respond to request (seller)
- `PUT /api/requests/:id/cancel` - Cancel request (buyer)
- `POST /api/requests/:id/submit` - Submit content for request (seller)
- `GET /api/requests/buyer` - Get buyer requests
- `GET /api/requests/seller` - Get seller requests

### Payment Routes

- `GET /api/payments` - Get all payments (admin)
- `GET /api/payments/:id` - Get single payment
- `POST /api/payments/create-intent` - Create payment intent (buyer)
- `POST /api/payments/confirm` - Confirm payment (buyer)
- `POST /api/payments/webhook` - Process Stripe webhook
- `GET /api/payments/buyer` - Get buyer payments
- `GET /api/payments/seller` - Get seller payments
- `POST /api/payments/:id/payout` - Process payout (admin)

### Notification Routes

- `GET /api/notifications` - Get all notifications (admin)
- `GET /api/notifications/me` - Get user notifications
- `POST /api/notifications` - Create notification (admin)
- `PUT /api/notifications/:id/read` - Mark notification as read
- `PUT /api/notifications/read-all` - Mark all notifications as read
- `DELETE /api/notifications/:id` - Delete notification
- `GET /api/notifications/unread-count` - Get unread notification count

### CMS Routes

- `GET /api/cms` - Get all CMS pages (admin)
- `GET /api/cms/published` - Get published CMS pages
- `GET /api/cms/:slug` - Get single CMS page by slug
- `POST /api/cms` - Create CMS page (admin)
- `PUT /api/cms/:id` - Update CMS page (admin)
- `DELETE /api/cms/:id` - Delete CMS page (admin)
- `POST /api/cms/contact` - Submit contact form

### Settings Routes

- `GET /api/settings` - Get all settings (admin)
- `GET /api/settings/public` - Get public settings
- `GET /api/settings/:id` - Get single setting (admin)
- `POST /api/settings` - Create setting (admin)
- `PUT /api/settings/:id` - Update setting (admin)
- `DELETE /api/settings/:id` - Delete setting (admin)
- `PUT /api/settings` - Update multiple settings (admin)

## License

This project is licensed under the MIT License.
