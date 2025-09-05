# Smart Parking System

This project is a web-based Smart Parking System designed to streamline the process of finding and booking parking spaces.

## Features
- User Registration & Login
- Interactive Map of Parking Lots
- Real-Time Slot Availability
- Online Booking
- Admin Dashboard

## Tech Stack
- **Frontend:** React
- **Backend:** Node.js, Express
- **Database:** JSON file (for now), planned migration to MySQL/Firebase

## Project Structure
```
/
├── backend/         # Node.js/Express server
│   ├── routes/      # API routes
│   ├── controllers/ # Route logic
│   ├── models/      # Data models (if needed)
│   ├── server.js    # Main server file
│   └── package.json
├── frontend/        # React client
└── README.md
```

## Getting Started

### Prerequisites
- Node.js and npm installed

### Installation

1.  **Backend:**
    ```bash
    cd backend
    npm install
    npm start
    ```
    The backend server will run on `http://localhost:5000`.

2.  **Frontend:**
    ```bash
    cd frontend
    npm install
    npm start
    ```
    The React development server will run on `http://localhost:3000`.
