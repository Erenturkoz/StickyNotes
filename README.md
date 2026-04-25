# 📌 Interactive Sticky Notes App

An interactive, drag-and-drop workspace for managing daily tasks, built with the MERN stack. Unlike traditional vertical todo lists, this application provides a dynamic "corkboard" experience where users can freely position their notes and archive them with smooth animations.

![Project Demo](./demo.gif) 
*(Note: Use a screen recorder to record a 10-15 second GIF of you adding a note, moving it, and archiving it. Save it as demo.gif in your root folder)*

## ✨ Key Features

* **Drag-and-Drop Workspace:** Freely move tasks across the screen. The exact X and Y coordinates are saved in real-time to the database, ensuring your layout is preserved across sessions.
* **Smart Archive System:** Completed tasks are visually swept away with a CSS animation and stored in a dedicated archive modal. They can be restored to their exact original coordinates at any time.
* **Authentication Ready:** Built on a secure user login and registration system using JWT (JSON Web Tokens).
* **Responsive State Management:** Seamless synchronization between the frontend React UI and the backend MongoDB database.
* **Custom UI:** Aesthetic "sticky note" design with a dotted background pattern and a clean, modal-based archive interface.

## 🛠️ Tech Stack

**Frontend:**
* React.js (Vite for fast builds)
* Axios (Data Fetching)
* React-Draggable (Interactive UI & Coordinate Tracking)
* Pure CSS (Custom animations, flexbox layouts, and styling)

**Backend:**
* Node.js & Express.js (RESTful API architecture)
* MongoDB & Mongoose (ODM for database management)
* JSON Web Token (JWT) for secure routing and user sessions
* CORS & Dotenv (Environment variable management)

## 📂 Project Architecture (Monorepo)

```text
sticky-notes/
├── backend/               # Server-side logic and database models
│   ├── config/            # Database connection configurations
│   ├── middleware/        # JWT Authentication middleware
│   ├── models/            # Mongoose schemas (User, Todo)
│   ├── routes/            # Express API endpoints
│   ├── controllers/       # Route logic and database operations
│   └── server.js          # Node.js entry point
├── frontend/              # Client-side application (React + Vite)
│   ├── src/
│   │   ├── components/    # Reusable UI parts (ArchiveModal, Navbar)
│   │   ├── Css/           # Component-specific styles
│   │   ├── pages/         # Main views (Home, Todo, Login, Register)
│   │   ├── App.jsx        # React Router setup
│   │   └── main.jsx       # React DOM rendering
│   └── package.json
└── README.md
