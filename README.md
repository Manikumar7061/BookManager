# Scoof Kindle

Scoof Kindle is an e-book library application inspired by Amazon Kindle. It provides a platform for reading, managing, and sharing books with an elegant and intuitive user interface.

## Features

- **User Authentication**: Secure login and registration system
- **Role-Based Access**: Different interfaces and permissions for admin and regular users
- **Book Management**: Add, view, and manage books (admin only can add books)
- **Reading Experience**: Built-in book reader with progress tracking
- **Favorites**: Add books to favorites for quick access
- **Progress Tracking**: Track reading progress across books
- **Reading Status**: Filter books by completed and in-progress status
- **Book Sharing**: Share books with other users via link

## Technology Stack

### Frontend
- **React**: UI library for building the user interface
- **TypeScript**: Type-safe JavaScript
- **Material UI**: Component library for modern UI elements
- **React Router**: For navigation between pages
- **Axios**: For API requests

### Backend
- **Node.js**: JavaScript runtime for the server
- **Express**: Web framework for Node.js
- **TypeScript**: For type safety
- **MySQL**: Relational database for data storage
- **JWT**: JSON Web Tokens for authentication
- **bcrypt**: For password hashing

## Project Structure

```
scoof-kindle/
├── client/                 # Frontend React application
│   ├── public/             # Static files
│   └── src/                # Source code
│       ├── components/     # UI components
│       ├── pages/          # Page components
│       ├── services/       # API service calls
│       ├── context/        # React context for state management
│       └── utils/          # Utility functions
│
├── server/                 # Backend Node.js application
│   ├── src/                # Source code
│   │   ├── config/         # Configuration files
│   │   ├── controllers/    # Request handlers
│   │   ├── middleware/     # Express middleware
│   │   ├── models/         # Database models
│   │   ├── routes/         # API routes
│   │   └── utils/          # Utility functions
│   └── dist/               # Compiled TypeScript
```

## Getting Started

### Prerequisites

- Node.js (v14 or later)
- MySQL (v8 or later)
- npm or yarn

### Backend Setup

1. Navigate to the server directory:
   ```bash
   cd scoof-kindle/server
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Create a `.env` file with the following variables (modify as needed):
   ```
   PORT=5000
   DB_HOST=localhost
   DB_USER=root
   DB_PASSWORD=your_password
   DB_NAME=scoof_kindle
   JWT_SECRET=your_jwt_secret_key
   ```

4. Set up the database:
   ```bash
   mysql -u root -p < src/config/schema.sql
   ```

5. Build and start the server:
   ```bash
   npm run build
   npm start
   ```
   
   For development with auto-reload:
   ```bash
   npm run dev
   ```

### Frontend Setup

1. Navigate to the client directory:
   ```bash
   cd scoof-kindle/client
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Create a `.env` file with the following variables:
   ```
   REACT_APP_API_URL=http://localhost:5000/api
   ```

4. Start the development server:
   ```bash
   npm start
   ```

## Demo Credentials

Two user accounts are created by default:

1. **Admin User**
   - Email: admin@example.com
   - Password: admin123

2. **Regular User**
   - Email: user@example.com
   - Password: user123

## Architecture

See [ARCHITECTURE.md](./ARCHITECTURE.md) for a detailed architecture diagram and explanation.
 
