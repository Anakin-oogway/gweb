# MERN Space - 3D MERN Stack Boilerplate

A modern, high-performance MERN (MongoDB, Express, React, Node.js) stack boilerplate featuring:
- **Fast Build Times**: Powered by [Vite](https://vite.dev/)
- **Interactive 3D Graphics**: Using `@react-three/fiber` and `@react-three/drei`
- **Fluid UI Animations**: Built with `framer-motion`
- **Premium Glassmorphic UI**: Tailored dark-mode theme utilizing vanilla CSS variables.
- **REST API + Database**: Connected to MongoDB via Mongoose.

---

## Getting Started

### Prerequisites
- [Node.js](https://nodejs.org/) installed
- [MongoDB](https://www.mongodb.com/) running locally (port `27017`) or a remote MongoDB Atlas URI.

### Directory Structure
```text
├── backend/            # Express.js Server
│   ├── .env            # Environment configuration
│   ├── server.js       # Entry point & API routes
│   └── package.json    # Backend dependencies
├── frontend/           # React App (Vite)
│   ├── src/
│   │   ├── components/
│   │   │   └── ThreeDScene.jsx  # R3F Canvas component
│   │   ├── App.jsx     # Main interface & state
│   │   ├── App.css     # UI layouts
│   │   └── index.css   # Theme & design tokens
│   ├── index.html      # SEO metadata
│   └── package.json    # Frontend dependencies
├── package.json        # Root workspace configuration
└── README.md           # Documentation
```

### Running the Application

In the root project directory, run:

```bash
# Start both backend and frontend servers concurrently
npm run dev
```

This starts:
1. **Frontend**: Vite Dev Server on `http://localhost:5173`
2. **Backend**: Express API Server on `http://localhost:5000`

---

## Configuration

### MongoDB Connection
By default, the backend connects to `mongodb://127.0.0.1:27017/mern_db`.
To modify this, edit the connection string inside `backend/.env`:

```env
MONGO_URI=mongodb+srv://<username>:<password>@cluster.mongodb.net/myDatabase
```

---

## Features Showcase
- **Real-Time Backend Status**: The header indicates connection status for the Express server and MongoDB.
- **3D Canvas**: Drag to rotate and interact with a wobbly iridescent sphere suspended inside a starfield.
- **Animated List Transitions**: Insert records into MongoDB and watch cards ease into the viewport via Framer Motion.
