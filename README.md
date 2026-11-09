# NoteStack

NoteStack is a full-stack note-taking and sharing web application built with the MERN stack (MongoDB, Express, React, Node.js) and styled with Tailwind CSS.

## Features

- **User Authentication**: Secure user registration and login with JWT and bcrypt password hashing (enforcing password complexity).
- **Personal Notes (CRUD)**: Create, view, edit, and delete personal notes.
- **Privacy & Sharing**: Toggle notes between private and public status.
- **Global Public Feed**: Read notes shared publicly by community members with author attribution.
- **Dark/Light Mode**: Theme switcher with persistent preference in local storage.

---

## Tech Stack

- **Frontend**: React 19, Vite, Tailwind CSS, React Router v7, Axios
- **Backend**: Node.js, Express 5, Mongoose 8, JWT, bcryptjs, Zod, express-mongo-sanitize, helmet, morgan, express-rate-limit, cors, dotenv
- **Database**: MongoDB (Atlas or local)

---

## Project Structure

```text
notes-app/
├── backend/
│   ├── controllers/      # Route controllers (auth, notes)
│   ├── middleware/       # Auth verification middleware (JWT)
│   ├── models/           # Mongoose schemas (User, Note)
│   ├── routes/           # Express routes (/api/users, /api/notes)
│   ├── .env.example      # Backend environment variables template
│   ├── index.js          # Express entrypoint
│   └── package.json
├── frontend/
│   ├── src/
│   │   ├── components/   # Navbar, NoteItem
│   │   ├── context/      # Auth & Theme context providers
│   │   ├── pages/        # Home, Login, Signup, Profile, Public Feed
│   │   ├── App.jsx
│   │   └── main.jsx
│   ├── .env.example      # Frontend environment variables template
│   └── package.json
└── README.md
```

---

## Getting Started

### Prerequisites

- [Node.js](https://nodejs.org/) (v18+ recommended; tested on v22)
- [npm](https://www.npmjs.com/) (v9+)
- A MongoDB instance (local or MongoDB Atlas connection string)

---

### Setup Instructions

#### 1. Backend Setup

1. Open a terminal and navigate to the backend folder:
   ```bash
   cd backend
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Create your `.env` configuration file from `.env.example`:
   ```bash
   cp .env.example .env
   ```
   Configure the following variables in `backend/.env`:
   - `MONGO_URI`: Your MongoDB connection string (e.g., `mongodb+srv://<user>:<password>@cluster0.example.mongodb.net/NoteStack?retryWrites=true&w=majority`)
   - `PORT`: Port for the API server (default: `5000`)
   - `JWT_SECRET`: Secret key used for signing JWT tokens
   - `CLIENT_URL`: Allowed client origin(s) for CORS, comma-separated (default: `http://localhost:5173`)

4. Start the backend:
   - For production / standard run:
     ```bash
     npm start
     ```
   - For development (with hot reload via nodemon):
     ```bash
     npm run dev
     ```
   The backend server runs at `http://localhost:5000`.

---

#### 2. Frontend Setup

1. Open a new terminal and navigate to the frontend folder:
   ```bash
   cd frontend
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Create your `.env` configuration file from `.env.example`:
   ```bash
   cp .env.example .env
   ```
   Configure `frontend/.env`:
   - `VITE_API_URL`: URL pointing to the backend API (`http://localhost:5000/api`)

4. Start the development server:
   ```bash
   npm run dev
   ```
5. Open your browser and navigate to:
   ```text
   http://localhost:5173
   ```

---

## Available Scripts

### Backend (`/backend`)
- `npm start`: Runs the Node.js server.
- `npm run dev`: Runs the Node.js server with `nodemon` for auto-reloading.

### Frontend (`/frontend`)
- `npm run dev`: Launches the Vite development server.
- `npm run build`: Compiles the React application for production.
- `npm run lint`: Runs ESLint to check code quality.
- `npm run preview`: Previews the production build locally.

