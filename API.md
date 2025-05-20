# Scoof Kindle API Documentation

This document provides details about the RESTful API endpoints available in the Scoof Kindle application.

## Base URL

```
http://localhost:5000/api
```

## Authentication

Most endpoints require authentication using JWT (JSON Web Token).

Include the token in the request header:

```
x-auth-token: <your_jwt_token>
```

### Auth Endpoints

#### Register User

```
POST /auth/register
```

Request Body:
```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "password123"
}
```

Response:
```json
{
  "message": "User registered successfully",
  "token": "jwt_token_here",
  "user": {
    "id": 1,
    "name": "John Doe",
    "email": "john@example.com",
    "role": "user"
  }
}
```

#### Login User

```
POST /auth/login
```

Request Body:
```json
{
  "email": "john@example.com",
  "password": "password123"
}
```

Response:
```json
{
  "message": "Login successful",
  "token": "jwt_token_here",
  "user": {
    "id": 1,
    "name": "John Doe",
    "email": "john@example.com",
    "role": "user"
  }
}
```

#### Get Current User

```
GET /auth/me
```

Response:
```json
{
  "id": 1,
  "role": "user"
}
```

### Book Endpoints

#### Get All Books

```
GET /books
```

Response:
```json
[
  {
    "id": 1,
    "title": "Book Title",
    "author": "Author Name",
    "description": "Book description...",
    "cover_image": "image_url",
    "content": "Book content...",
    "created_by": 1,
    "created_at": "2023-01-01T00:00:00Z",
    "updated_at": "2023-01-01T00:00:00Z",
    "current_position": 0,
    "is_completed": false,
    "is_favorite": false
  },
  // ...more books
]
```

#### Get Book by ID

```
GET /books/:id
```

Response:
```json
{
  "id": 1,
  "title": "Book Title",
  "author": "Author Name",
  "description": "Book description...",
  "cover_image": "image_url",
  "content": "Book content...",
  "created_by": 1,
  "created_at": "2023-01-01T00:00:00Z",
  "updated_at": "2023-01-01T00:00:00Z",
  "current_position": 0,
  "is_completed": false,
  "is_favorite": false
}
```

#### Add Book (Admin Only)

```
POST /books
```

Request Body:
```json
{
  "title": "New Book",
  "author": "Author Name",
  "description": "Book description...",
  "coverImage": "image_url",
  "content": "Book content..."
}
```

Response:
```json
{
  "message": "Book added successfully",
  "book": {
    "id": 2,
    "title": "New Book",
    "author": "Author Name",
    "description": "Book description...",
    "cover_image": "image_url",
    "content": "Book content...",
    "created_by": 1,
    "created_at": "2023-01-02T00:00:00Z",
    "updated_at": "2023-01-02T00:00:00Z"
  }
}
```

#### Update Reading Progress

```
PUT /books/progress/:id
```

Request Body:
```json
{
  "currentPosition": 100,
  "isCompleted": false
}
```

Response:
```json
{
  "message": "Reading progress updated successfully"
}
```

#### Toggle Favorite

```
PUT /books/favorite/:id
```

Request Body:
```json
{
  "isFavorite": true
}
```

Response:
```json
{
  "message": "Book added to favorites"
}
```

#### Get Favorite Books

```
GET /books/favorites/list
```

Response: Array of books (same format as Get All Books)

#### Get Completed Books

```
GET /books/completed/list
```

Response: Array of books (same format as Get All Books)

#### Get In-Progress Books

```
GET /books/in-progress/list
```

Response: Array of books (same format as Get All Books)

### User Endpoints

#### Get User Profile

```
GET /users/profile
```

Response:
```json
{
  "message": "User profile retrieved successfully"
}
```

#### Get Reading History

```
GET /users/reading-history
```

Response:
```json
{
  "message": "Reading history retrieved successfully"
}
```

#### Get User's Favorite Books

```
GET /users/favorites
```

Response:
```json
{
  "message": "Favorite books retrieved successfully"
}
```

## Error Responses

All endpoints return appropriate HTTP status codes:

- `200` - Success
- `201` - Created successfully
- `400` - Bad request (validation errors)
- `401` - Unauthorized (authentication required)
- `403` - Forbidden (insufficient permissions)
- `404` - Resource not found
- `500` - Server error

Error Response Format:
```json
{
  "message": "Error message here"
}
```

or with validation errors:

```json
{
  "errors": [
    {
      "param": "email",
      "msg": "Please enter a valid email"
    }
  ]
}
``` 