# Scoof Kindle Architecture

This document provides an overview of the Scoof Kindle application architecture.

## System Overview

Scoof Kindle follows a classic three-tier architecture:

1. **Frontend (Client)**: React-based user interface
2. **Backend (Server)**: Node.js/Express API server
3. **Database**: MySQL database for data persistence

## Architecture Diagram

```mermaid
graph TD
    subgraph "Frontend (React)"
        A[User Interface] --> B[State Management]
        B --> C[API Service]
        C -->|HTTP Requests| D[REST API]
    end
    
    subgraph "Backend (Node.js/Express)"
        D --> E[Routes]
        E --> F[Controllers]
        F --> G[Models]
        F --> H[Middleware]
        H -->|Authentication| F
        G -->|Database Queries| I[Database]
    end
    
    subgraph "Database (MySQL)"
        I --> J[Users Table]
        I --> K[Books Table]
        I --> L[Reading Progress Table]
        I --> M[Favorites Table]
    end
```

## Component Interaction

```mermaid
sequenceDiagram
    actor User
    participant UI as User Interface
    participant API as API Client
    participant Server as Express Server
    participant Auth as Auth Middleware
    participant Controller as Controllers
    participant Model as Models
    participant DB as MySQL Database
    
    User->>UI: Interacts with app
    UI->>API: Makes API call
    API->>Server: HTTP Request
    Server->>Auth: Check authentication
    Auth->>Server: Authentication result
    Server->>Controller: Handle request
    Controller->>Model: Database operations
    Model->>DB: Query execution
    DB->>Model: Query results
    Model->>Controller: Data
    Controller->>Server: Response data
    Server->>API: HTTP Response
    API->>UI: Update state
    UI->>User: Updated view
```

## Database Schema

```mermaid
erDiagram
    USERS {
        int id PK
        string name
        string email
        string password
        enum role
        timestamp created_at
        timestamp updated_at
    }
    
    BOOKS {
        int id PK
        string title
        string author
        string description
        string cover_image
        text content
        int created_by FK
        timestamp created_at
        timestamp updated_at
    }
    
    READING_PROGRESS {
        int id PK
        int user_id FK
        int book_id FK
        int current_position
        boolean is_completed
        timestamp last_read_at
    }
    
    FAVORITES {
        int id PK
        int user_id FK
        int book_id FK
        timestamp created_at
    }
    
    USERS ||--o{ BOOKS : creates
    USERS ||--o{ READING_PROGRESS : has
    USERS ||--o{ FAVORITES : has
    BOOKS ||--o{ READING_PROGRESS : tracked_in
    BOOKS ||--o{ FAVORITES : saved_in
```

## Authentication Flow

```mermaid
flowchart TD
    A[User] -->|Credentials| B[Login Request]
    B --> C{Valid?}
    C -->|No| D[Error Response]
    C -->|Yes| E[Generate JWT]
    E --> F[Return Token]
    F --> G[Store in Client]
    G --> H[Authenticated Requests]
    H --> I{Valid Token?}
    I -->|No| J[401 Unauthorized]
    I -->|Yes| K[Access Resources]
```

## Admin vs User Flow

```mermaid
flowchart TD
    A[Login] --> B{Role?}
    B -->|Admin| C[Admin Dashboard]
    B -->|User| D[User Dashboard]
    
    C --> E[Manage Books]
    C --> F[View All Books]
    C --> G[Read Books]
    
    D --> F
    D --> G
    
    E --> H[Add Books]
    E --> I[Edit Books]
    
    F --> J[Filter Books]
    F --> K[Search Books]
    
    G --> L[Track Progress]
    G --> M[Add to Favorites]
    G --> N[Share Books]
```

## Deployment Architecture

```mermaid
flowchart TD
    subgraph Client
        A[React App] --> B[Web Browser]
    end
    
    subgraph "Server (Node.js)"
        C[Express API] --> D[Business Logic]
        D --> E[Database Access]
    end
    
    subgraph Database
        F[MySQL]
    end
    
    B <-->|HTTP/HTTPS| C
    E <-->|SQL Queries| F
```

This architecture provides a clear separation of concerns, making the system modular, maintainable, and scalable. 