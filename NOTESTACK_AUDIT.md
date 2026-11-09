# NoteStack — Complete Codebase Audit Report

**Date of Audit:** November 9, 2026  
**Auditor:** Senior MERN Engineer  
**Audit Type:** Read-Only Full Codebase Inspection & Verification  

---

## 1. Overview

**NoteStack** is a full-stack MERN application designed for personal note management with optional public publishing. Authenticated users can register, log in, create, edit, delete, and browse personal notes in a multi-column responsive dashboard. Each note can be designated as either private or publicly shared; public notes are immediately aggregated into an open, unauthenticated global discovery feed showing author attribution and creation dates. The application also provides user profile inspection, persistent client-side light/dark theme toggling, and client/server password complexity validation.

- **Project Type:** Polyrepo-style multi-folder project within a single repository (separated `backend/` and `frontend/` directories without a root monorepo tool like Turborepo, Nx, or Lerna workspaces).
- **Project Size:**
  - **Backend:** 12 files, ~1,896 lines of code (including configs and JSON files; ~370 lines of pure JavaScript logic across controllers, models, middleware, and routes).
  - **Frontend:** 25 files, ~5,226 lines of code (including configs, HTML, and lockfile; ~780 lines of pure JSX/JS code across pages, components, and contexts).
- **Git Info:**
  - Total Commits: `2` (`fac9512 Note Taking application`, `a14fe0b feat: bug fix`)
  - Active Branches: `main`, `remotes/origin/main`
  - Last Commit Date: `Mon Nov 9 10:58:09 2026 +0530`

---

## 2. Folder Structure

```text
notes-app/                               # Root directory containing frontend and backend
├── .gitignore                           # Root ignore file for node_modules, .env files, and dist
├── README.md                            # Main project documentation, setup, and command guide
├── NOTESTACK_AUDIT.md                   # Complete architectural and engineering audit report
│
├── backend/                             # Express & Mongoose API application
│   ├── .env                             # Local backend environment variables (secrets)
│   ├── .env.example                     # Environment template defining required variables
│   ├── .gitignore                       # Backend specific ignore file
│   ├── index.js                         # Application entrypoint, middleware, DB connection & route mounting
│   ├── package.json                     # Backend dependencies and execution scripts
│   ├── package-lock.json                # Locked dependency tree for backend
│   ├── controllers/                     # Request handling and database business logic
│   │   ├── authController.js            # User registration, login, and profile fetching handlers
│   │   └── noteController.js            # Note CRUD operations and public feed handlers
│   ├── middleware/                      # HTTP request filters and authenticators
│   │   └── authMiddleware.js            # Verifies JWT from x-auth-token header and injects req.user
│   ├── models/                          # Mongoose database schemas
│   │   ├── Note.js                      # Schema for notes (title, content, user ref, isPublic, timestamps)
│   │   └── User.js                      # Schema for registered users (name, email, password, timestamps)
│   └── routes/                          # REST API endpoint route definitions
│       ├── auth.js                      # Endpoints for /api/users (register, login, profile)
│       └── notes.js                     # Endpoints for /api/notes (CRUD and public feed)
│
└── frontend/                            # React 19 single-page application built with Vite
    ├── .env                             # Local frontend environment variables (API URL)
    ├── .env.example                     # Frontend environment template (VITE_API_URL)
    ├── .gitignore                       # Frontend ignore rules (node_modules, dist)
    ├── eslint.config.js                 # Flat ESLint configuration with react-hooks and react-refresh rules
    ├── index.html                       # HTML5 template and React root mount point
    ├── package.json                     # Frontend dependencies and Vite scripts
    ├── package-lock.json                # Locked dependency tree for frontend
    ├── postcss.config.js                # PostCSS configuration for Tailwind CSS
    ├── README.md                        # Standard Vite boilerplate documentation
    ├── tailwind.config.js               # Tailwind CSS theme configuration (darkMode: 'class')
    ├── vite.config.js                   # Vite bundler configuration with @vitejs/plugin-react
    └── src/                             # Client-side source code
        ├── App.jsx                      # Route layout, navigation tree, and protected route gates
        ├── index.css                    # Tailwind CSS directives (@tailwind base/components/utilities)
        ├── main.jsx                     # DOM rendering with StrictMode, BrowserRouter, and Context Providers
        ├── components/                  # Shared modular React UI elements
        │   ├── Navbar.jsx               # Header navigation, brand link, auth buttons, theme switch
        │   └── NoteItem.jsx             # Note card with edit, delete, and public/private toggle actions
        ├── context/                     # React Context State Providers
        │   ├── AuthContext.jsx          # Auth provider handling login, signup, logout, and token persistence
        │   ├── AuthContextCore.js       # Standalone AuthContext creation for fast-refresh compliance
        │   ├── ThemeContext.jsx         # Theme provider handling dark/light class toggle and storage
        │   └── ThemeContextCore.js      # Standalone ThemeContext creation for fast-refresh compliance
        └── pages/                       # Route-level views and screen containers
            ├── HomePage.jsx             # User dashboard with note creation/editing form and notes list
            ├── LoginPage.jsx            # User sign-in form with credential validation
            ├── ProfilePage.jsx          # Account profile details page (name, email, member since)
            ├── PublicFeedPage.jsx       # Global unauthenticated feed of public notes
            ├── PublicNotePage.jsx       # Single public note viewer displaying full content and author
            └── SignupPage.jsx           # User registration form with client-side password validation
```

---

## 3. Tech Stack and Versions

### Runtimes
- **Node.js:** Installed `v22.13.1` (Requirement: Node 18+ recommended due to Express 5 / React 19).
- **npm:** Installed `10.9.2` (Requirement: npm 9+).

### Backend Dependencies (`backend/package.json`)
| Package | Version in `package.json` | Installed | Outdated Status | Deprecated / Unused |
|---|---|---|---|---|
| `bcryptjs` | `^3.0.2` | `3.0.2` | Minor available (`3.0.3`) | Actively used in `authController.js` |
| `cors` | `^2.8.5` | `2.8.5` | Minor available (`2.8.6`) | Actively used in `index.js` |
| `dotenv` | `^17.2.3` | `17.2.3` | Major available (`18.0.10`) | Actively used in `index.js` |
| `express` | `^5.1.0` | `5.1.0` | Minor available (`5.3.0`) | Actively used across server |
| `jsonwebtoken` | `^9.0.2` | `9.0.2` | Patch available (`9.0.3`) | Actively used in `authController.js`, `authMiddleware.js` |
| `mongoose` | `^8.19.1` | `8.24.8` | Major available (`9.12.0`) | Actively used across models & index |
| `nodemon` (dev) | `^3.1.14` | `3.1.14` | Up to date in range | Actively used in `npm run dev` script |

### Frontend Dependencies (`frontend/package.json`)
| Package | Version in `package.json` | Installed | Outdated Status | Deprecated / Unused |
|---|---|---|---|---|
| `axios` | `^1.12.2` | `1.12.2` | Minor available (`1.21.0`) | Actively used in contexts and pages |
| `react` | `^19.1.1` | `19.2.0` | Patch available (`19.3.1`) | Core UI library |
| `react-dom` | `^19.1.1` | `19.2.0` | Patch available (`19.3.1`) | DOM renderer |
| `react-router-dom` | `^7.9.4` | `7.9.4` | Minor available (`7.18.5`) | Core client routing library |
| `@eslint/js` (dev) | `^9.36.0` | `9.37.0` | Major available (`10.0.1`) | Linter |
| `@types/react` (dev) | `^19.1.16` | `19.2.2` | Minor available (`19.3.0`) | Type stubs |
| `@types/react-dom` (dev)| `^19.1.9` | `19.2.1` | Minor available (`19.3.0`) | Type stubs |
| `@vitejs/plugin-react` (dev)| `^5.0.4` | `5.0.4` | Major available (`6.2.1`) | Vite React plugin |
| `autoprefixer` (dev) | `^10.4.21` | `10.4.21` | Minor available (`10.6.2`) | PostCSS plugin |
| `eslint` (dev) | `^9.36.0` | `9.37.0` | Major available (`10.14.0`) | Code quality tooling |
| `eslint-plugin-react-hooks` (dev)| `^5.2.0` | `5.2.0` | Major available (`7.1.1`) | Linting React hooks |
| `eslint-plugin-react-refresh` (dev)| `^0.4.22` | `0.4.23` | Major available (`0.5.7`) | HMR rules |
| `globals` (dev) | `^16.4.0` | `16.4.0` | Major available (`17.14.0`) | Global definitions for ESLint |
| `postcss` (dev) | `^8.5.6` | `8.5.6` | Patch available (`8.5.32`) | CSS pipeline |
| `tailwindcss` (dev) | `^3.4.18` | `3.4.18` | Major available (`4.3.5`) | Utility CSS engine |
| `vite` (dev) | `^7.1.7` | `7.1.9` | Major available (`8.3.6`) | Build bundler / Dev server |

### Architectural Categorization
- **Frontend:**
  - Build Tool: Vite 7
  - Routing: React Router v7 (`BrowserRouter`, `Routes`, `Route`, `Navigate`, `Link`, `useParams`, `useNavigate`)
  - State Management: React Context API (`AuthContext`, `ThemeContext`) + Local component `useState`
  - UI Library: None (Custom Tailwind CSS components; no component library like Shadcn, MUI, or Chakra)
  - Styling Approach: Utility-first CSS using Tailwind CSS v3 with dark mode class strategy (`darkMode: 'class'`)
  - HTTP Client: Axios v1.12.2 with base URL injected and global `defaults.headers.common['x-auth-token']`
- **Backend:**
  - Framework: Express 5 (`^5.1.0`)
  - ODM: Mongoose 8 (`^8.19.1`)
  - Validation: Custom regex in controller (`validatePasswordComplexity`), Mongoose schema validation (`required: true`, `unique: true`, `trim: true`)
  - Auth Libraries: `jsonwebtoken` (JWT creation and signature verification), `bcryptjs` (salt generation and password hashing)
  - Middleware: `cors` (unrestricted origin), `express.json()` (body parsing), custom `authMiddleware`

---

## 4. Backend Analysis

### API Routes Table
All routes are mounted in [backend/index.js](file:///d:/notes-app/backend/index.js).

| Method | Endpoint | Controller Handler | Auth Required | Description |
|---|---|---|:---:|---|
| `POST` | `/api/users/register` | `authController.register` | **No** | Validates email uniqueness and password complexity, hashes password with `bcryptjs`, saves user, and issues a 1-hour JWT. |
| `POST` | `/api/users/login` | `authController.login` | **No** | Verifies email and password hash match, returns a 1-hour JWT. |
| `GET` | `/api/users/profile` | `authController.getProfile` | **Yes** | Fetches user document by `req.user.id` excluding the password hash. |
| `GET` | `/api/notes/public/feed` | `noteController.getPublicFeed` | **No** | Returns all notes with `{ isPublic: true }` sorted by `updatedAt: -1`, populating author `name` and `email`. |
| `GET` | `/api/notes/public/:id` | `noteController.getPublicNote` | **No** | Fetches a single public note by `_id` with populated author details. Returns 404 if not found or private. |
| `GET` | `/api/notes` | `noteController.getNotes` | **Yes** | Retrieves all notes owned by the authenticated user (`{ user: req.user.id }`), sorted by `updatedAt: -1`. |
| `POST` | `/api/notes` | `noteController.createNote` | **Yes** | Creates a new note linked to `req.user.id` with `title`, `content`, and `isPublic` (defaults to `false`). |
| `PUT` | `/api/notes/:id` | `noteController.updateNote` | **Yes** | Updates note fields (`title`, `content`, `isPublic`). Verifies that `note.user.toString() === req.user.id`. |
| `DELETE` | `/api/notes/:id` | `noteController.deleteNote` | **Yes** | Verifies note ownership and deletes the note document from the collection. |

### Database Models / Schemas
Located in [backend/models/](file:///d:/notes-app/backend/models):

1. **`User` Schema (`backend/models/User.js`):**
   - `name`: `String`, required
   - `email`: `String`, required, unique index
   - `password`: `String`, required (stores bcrypt hash)
   - `timestamps`: `true` (`createdAt`, `updatedAt`)
   - **Indexes:** Automatic unique index on `email`.

2. **`Note` Schema (`backend/models/Note.js`):**
   - `user`: `mongoose.Schema.Types.ObjectId`, `ref: 'User'`, required
   - `title`: `String`, required, `trim: true`
   - `content`: `String`, required
   - `isPublic`: `Boolean`, default: `false`
   - `timestamps`: `true` (`createdAt`, `updatedAt`)
   - **Relationships:** Many-to-one relationship to `User` model via `user` field.

### Authentication Flow
- **Registration:** Accepts `name`, `email`, `password`. Enforces `/^(?=.*[!@#$%^&*])(?=.{8,})/` (8+ characters, at least 1 special symbol). Hashes with `bcrypt.genSalt(10)`. Signs JWT payload `{ user: { id: user.id } }` with `process.env.JWT_SECRET` for `1h`.
- **Login:** Verifies user by email, compares password with `bcrypt.compare`. Signs identical 1-hour JWT.
- **Token Mechanism:** Stateless JWT sent in custom HTTP header `x-auth-token`.
- **Client Storage:** Stored in browser `localStorage` under key `token`.
- **Token Expiry & Refresh:** 1-hour expiry. **Refresh token logic is NOT PRESENT.** Once expired, requests fail with status 401, causing `AuthContext` to clear state and redirect to `/login`.
- **Protected Middleware (`backend/middleware/authMiddleware.js`):** Inspects `req.header('x-auth-token')`. Decodes via `jwt.verify(token, process.env.JWT_SECRET)`. Attaches `req.user = decoded.user` or returns 401 JSON.
- **Data Association:** Notes are strictly linked to users via `user: req.user.id`. Updating or deleting notes enforces an ownership check: `note.user.toString() !== req.user.id -> 401 Not authorized`.

### Validation, Error Handling, and Security
- **Validation:** No external validation library (Joi/Zod/express-validator not present). Handled via manual `if` checks in controllers and Mongoose schema constraints.
- **Error Handling:** Standard `try/catch` in controllers. Returns generic `500 Server Error` with `console.error` logs. Catches `err.kind === 'ObjectId'` for 404 responses.
- **Security Middleware:**
  - `cors`: Present (`app.use(cors())`), but has wildcard access (all origins permitted).
  - `helmet`: **Not present**.
  - `rate-limiting`: **Not present**.
  - Input sanitization / NoSQL injection protection: **Not present**.
- **Logging:** Basic `console.log` and `console.error` in controllers and server startup. No dedicated logger (Winston/Morgan not present).
- **External Services:**
  - Redis: **Not present**.
  - Email / OTP: **Not present**.
  - File Upload / Multer / Cloud Storage (S3, Cloudinary): **Not present**.
  - Third-party APIs: **Not present**.
- **Environment Variables:**
  - Code reads: `MONGO_URI`, `PORT`, `JWT_SECRET`.
  - `.env.example` status: **Present** in `backend/.env.example`.

---

## 5. Frontend Analysis

### Pages and Routing (`frontend/src/App.jsx`)
- `/` (`HomePage`): Main authenticated workspace. Displays note creation/editing form and grid of personal note cards. Redirects unauthenticated users to `/login`.
- `/note/:id` (`HomePage`): Same container as home; displays note dashboard.
- `/profile` (`ProfilePage`): Shows user details (name, email, membership date from `createdAt`). Redirects unauthenticated users to `/login`.
- `/login` (`LoginPage`): Email and password submission form. Redirects authenticated users to `/`.
- `/signup` (`SignupPage`): Name, email, and password form with client-side password strength validation. Redirects authenticated users to `/`.
- `/feed` (`PublicFeedPage`): Publicly visible gallery of shared notes with author cards. Accessible to both authenticated and unauthenticated guests.
- `/view/:id` (`PublicNotePage`): Public view of an individual shared note with full content, author, and share date.
- `*`: Wildcard fallback redirecting to `/`.

### Main Components (`frontend/src/components/`)
- `Navbar.jsx`: Top navigation bar. Renders brand logo, light/dark mode toggle button, public feed link, and conditional elements (login/signup links for guests; user display name and Logout button for authenticated users).
- `NoteItem.jsx`: Individual note presentation card on the dashboard. Shows note title, truncated content (`line-clamp-3`), updated date, public/private badge, and action buttons (`Edit`, `Delete`, `Make Public` / `Make Private`).

### State Management & Data Fetching
- State is managed via React Context:
  - `AuthContext`: Holds `token`, `user`, `loading`, and provides `login()`, `signup()`, `logout()`.
  - `ThemeContext`: Holds `theme` (`'light'` or `'dark'`), saves to `localStorage.theme`, updates root HTML `<html class="dark">`, and provides `toggleTheme()`.
- Data Fetching: Direct `axios` calls inside component `useEffect` and event handlers.
- API URL Configuration: Centralized via `import.meta.env.VITE_API_URL || 'http://localhost:5000/api'`.

### Auth Token Handling & Route Protection
- Stored in browser `localStorage.getItem('token')`.
- On boot or login, sets `axios.defaults.headers.common['x-auth-token'] = token`.
- When requests return 401 or profile fetching fails, `logout()` is invoked, clearing storage and headers.
- Route protection is achieved in `App.jsx` using ternary elements: `token ? <HomePage /> : <Navigate to="/login" />`.

### UI Features Inventory
- **Search:** **Not present**.
- **Filters:** **Not present** (private notes show in one list; no filter by tag or visibility).
- **Tags / Labels:** **Not present**.
- **Pin / Favorite:** **Not present**.
- **Archive:** **Not present**.
- **Trash / Soft Delete:** **Not present** (deletion is immediate and permanent).
- **Sorting:** Built into backend queries (`updatedAt: -1`), but no UI sort controls exist.
- **Pagination / Infinite Scroll:** **Not present** (all notes loaded in a single payload).
- **Editor Type:** Plain HTML `<textarea>` (No Markdown rendering, no WYSIWYG/rich-text editor).
- **Dark Mode:** **Present** (toggles `dark` class on `document.documentElement` and persists to `localStorage`).
- **Responsiveness:** **Present** (Tailwind responsive grid: `grid-cols-1 md:grid-cols-2 lg:grid-cols-3` and container constraints).
- **Loading & Error States:** Basic text banners (`Loading Application...`, `Loading Public Feed...`, `window.alert()` for errors).

---

## 6. Feature Inventory

| Feature | Status | Verification Details |
|---|:---:|---|
| User Registration | **Working** | Tested via API & UI; enforces 8+ chars & special symbol; returns JWT. |
| User Login | **Working** | Tested with valid and invalid credentials; issues 1-hour JWT. |
| User Profile View | **Working** | Fetches `/api/users/profile`, renders name, email, member since. |
| Create Note (Private) | **Working** | Saved with `isPublic: false` linked to user ID. |
| Create Note (Public) | **Working** | Saved with `isPublic: true` linked to user ID. |
| Edit Note | **Working** | Updates note title/content, verifies user ownership. |
| Delete Note | **Working** | Removes note from database, verifies user ownership. |
| Toggle Public/Private | **Working** | `Make Public` / `Make Private` button flips boolean in DB. |
| Global Public Feed | **Working** | Fetches only public notes with populated author name/email. |
| Public Note Detail | **Working** | Displays single note at `/view/:id`; rejects private notes. |
| Dark / Light Theme | **Working** | Toggles HTML class, persists selection in `localStorage`. |
| Session Expiry Handling | **Working** | 401 response triggers auto-logout and redirect. |
| Note Search | **Not Implemented** | No search input or backend query regex exists. |
| Tagging / Categories | **Not Implemented** | No tag attributes in schema or UI. |
| Rich Text / Markdown | **Not Implemented** | Standard multi-line textarea only. |
| Pagination | **Not Implemented** | Full unbounded list returned from database. |
| Password Reset / Email | **Not Implemented** | No email provider or recovery endpoints. |

---

## 7. Run and Health Check

### Live Verification Status
- **Backend Service:** Running on `http://localhost:5000` (`node index.js`).
- **Frontend Service:** Running on `http://localhost:5173` (`vite`).
- **Database Connection:** Verified active connection to MongoDB Atlas.

### Terminal & Console Diagnostics
- **Backend Terminal:** Clean output. Log confirms `Server started on port 5000` and `MongoDB Connected...`.
- **Frontend Build (`npm run build`):** Clean compilation in 2.01s with zero errors:
  ```text
  dist/index.html                   0.44 kB │ gzip:  0.30 kB
  dist/assets/index-BKu8NfgS.css   15.51 kB │ gzip:  3.37 kB
  dist/assets/index-CxJwxw4m.js   280.48 kB │ gzip: 91.16 kB
  ```
- **Linter Check (`npm run lint`):** ESLint passes with 0 errors and 0 warnings.
- **Browser Output:** HTTP status `200 OK` on `/`, `/login`, `/signup`, `/feed`.
- **Blockers:** **None**. The application runs cleanly and is completely functional.

---

## 8. Code Quality Assessment

- **Separation of Concerns:** Good standard MVC architecture on the backend (`routes/`, `controllers/`, `models/`, `middleware/`). Frontend cleanly distinguishes between `pages/`, `components/`, and `context/`.
- **Naming Conventions:** Consistent camelCase for JavaScript functions/files (`authController.js`), PascalCase for React components and Mongoose models (`NoteItem.jsx`, `User.js`).
- **Code Duplication:** Minimal duplication. Note card logic is encapsulated in `NoteItem.jsx`.
- **Dead Code / Leftover Logs:**
  - Backend has leftover `console.error(err.message)` in catch blocks without structured logging.
  - Frontend uses `window.alert()` for network/validation errors instead of modern toast notifications.
- **Hardcoded Secrets:**
  - In `backend/.env`, sensitive credentials (`MONGO_URI`, `JWT_SECRET`) are present. Both `backend/.gitignore` and root `.gitignore` properly exclude `.env` from version control.
- **Testing:**
  - Unit/Integration Tests: **Not present** (No Jest, Vitest, Mocha, Supertest, or React Testing Library suites).
  - `backend/package.json` contains: `"test": "echo \"Error: no test specified\" && exit 1"`.
- **CI/CD & DevOps:**
  - Docker / Dockerfile / docker-compose: **Not present**.
  - GitHub Actions / CI workflows: **Not present**.
  - API Documentation (Swagger / Postman collection): **Not present**.
- **README Quality:** Comprehensive setup instructions, architecture breakdown, and environment configuration guide present in root `README.md`.

---

## 9. Security and Bugs

| Severity | Issue | File Path | Description |
|:---:|---|---|---|
| **High** | Wildcard CORS Configuration | [backend/index.js](file:///d:/notes-app/backend/index.js#L14) | `app.use(cors())` allows requests from any origin without domain restrictions. |
| **High** | No Rate Limiting on Auth | [backend/routes/auth.js](file:///d:/notes-app/backend/routes/auth.js) | `/api/users/login` and `/register` have no rate limiting (`express-rate-limit`), exposing them to automated credential brute-forcing. |
| **Medium** | Missing Security Headers | [backend/index.js](file:///d:/notes-app/backend/index.js) | `helmet` middleware is not installed or configured, omitting X-Frame-Options, CSP, and HSTS headers. |
| **Medium** | JWT in `localStorage` | [frontend/src/context/AuthContext.jsx](file:///d:/notes-app/frontend/src/context/AuthContext.jsx) | Storing access tokens in `localStorage` leaves them susceptible to exfiltration via Cross-Site Scripting (XSS). |
| **Medium** | Unbounded Query Payload | [backend/controllers/noteController.js](file:///d:/notes-app/backend/controllers/noteController.js#L8) | `Note.find()` queries do not implement limit/pagination, which could exhaust server memory if note counts scale. |
| **Medium** | Blocking UI Alerts | [frontend/src/pages/HomePage.jsx](file:///d:/notes-app/frontend/src/pages/HomePage.jsx#L58) | Uses native `alert()` and `window.confirm()`, which block the browser thread and degrade user experience. |
| **Low** | No Request Body Sanitization | [backend/controllers/noteController.js](file:///d:/notes-app/backend/controllers/noteController.js#L15) | Content fields are saved directly to MongoDB without HTML sanitization (e.g., `DOMPurify` or `sanitize-html`). |
| **Low** | JWT Expiry without Refresh | [backend/controllers/authController.js](file:///d:/notes-app/backend/controllers/authController.js#L40) | Tokens expire strictly after 1 hour with no refresh rotation, disrupting active user sessions abruptly. |

---

## 10. CV-Readiness Gap Analysis

### Honest Project Rating: `5.5 / 10`
**Why:**
NoteStack is a solid demonstration of foundational MERN mechanics: relational schema referencing, JWT authentication, password hashing with complexity rules, protected Express middleware, and a responsive React UI with theme toggling. However, for a competitive Senior/Mid-level engineering portfolio, it currently reads as an introductory tutorial project because it lacks automated testing, production deployment configurations, CI/CD, pagination, caching, search/filter capabilities, and advanced authentication workflows (OAuth/refresh tokens).

### Improvement Matrix
| Feature | Impact | Status | Description |
|---|:---:|:---:|---|
| Rate Limiting & Helmet | **High** | Missing | Add `express-rate-limit` and `helmet` for baseline API protection. |
| Full-Text Search & Tagging | **High** | Missing | MongoDB `$text` search index or regex query across title/content with tag filtering. |
| Pagination & Infinite Scroll | **High** | Missing | Cursor or page-based limit/skip queries (`/api/notes?page=1&limit=10`). |
| Comprehensive Testing | **High** | Missing | Vitest + React Testing Library for frontend; Supertest + Jest/Node test runner for backend API. |
| Docker & Containerization | **Medium** | Missing | Multi-stage `Dockerfile` and `docker-compose.yml` orchestrating MongoDB, API, and client. |
| CI/CD Pipeline | **Medium** | Missing | GitHub Actions workflow automating linting, testing, and Docker builds on pull requests. |
| Refresh Token Rotation | **Medium** | Missing | HTTP-only cookie refresh tokens paired with short-lived memory access tokens. |
| Rich Text / Markdown Editor | **Medium** | Missing | Integrated Markdown preview (e.g., `react-markdown` or Tiptap) for richer notes. |
| Toast Notifications | **Low** | Missing | Replace `alert()` with modern notification toasts (`react-hot-toast` or `sonner`). |
| Redis Caching | **Low** | Missing | Cache public feed responses in Redis with invalidation on new public note creation. |

---

### Step-by-Step Upgrade Roadmap

1. **Phase 1: API Security & Resilience (Est. Effort: 2-3 hours)**
   - Install and configure `helmet` in [backend/index.js](file:///d:/notes-app/backend/index.js).
   - Add `express-rate-limit` to `/api/users/login` and `/api/users/register` (e.g., max 10 attempts per 15 minutes).
   - Constrain CORS to specific allowed origins via environment variables.

2. **Phase 2: Search, Filtering & Pagination (Est. Effort: 4-5 hours)**
   - Add `tags: [{ type: String }]` and a text index on `title` and `content` in [backend/models/Note.js](file:///d:/notes-app/backend/models/Note.js).
   - Update `getNotes` and `getPublicFeed` to accept `?search=`, `?tag=`, `?page=`, and `?limit=`.
   - Build a search bar and tag filter chips in [frontend/src/pages/HomePage.jsx](file:///d:/notes-app/frontend/src/pages/HomePage.jsx) and [frontend/src/pages/PublicFeedPage.jsx](file:///d:/notes-app/frontend/src/pages/PublicFeedPage.jsx).

3. **Phase 3: Markdown & Modern UI Polish (Est. Effort: 3 hours)**
   - Replace standard textarea with a Markdown editor and live preview panel using `react-markdown`.
   - Replace all `alert()` and `window.confirm()` calls with `react-hot-toast` and accessible modal dialogs.

4. **Phase 4: Automated Testing Suite (Est. Effort: 5-6 hours)**
   - Add backend integration tests using `supertest` against an in-memory MongoDB instance (`mongodb-memory-server`).
   - Add frontend component tests using `vitest` and `@testing-library/react` for login, registration, and note item rendering.

5. **Phase 5: DevOps & Containerization (Est. Effort: 3-4 hours)**
   - Write a multi-stage `Dockerfile` for the frontend (Vite build served via Nginx) and backend (Node Alpine).
   - Create `docker-compose.yml` to launch MongoDB, backend API, and frontend client with a single command.
   - Configure a GitHub Actions workflow (`.github/workflows/ci.yml`) to run linting and tests on every push.

