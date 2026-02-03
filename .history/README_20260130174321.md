# Sort Visualizer

**se04project-std6-team-tetris**

This application runs various sorting algorithms on the backend and **visualizes the sorting process (logs) on the frontend**.  
It is intended for learning and understanding how sorting algorithms work.

---

## Tech Stack

- **Backend**: C (custom HTTP server)
- **Frontend**: React + Vite
- **Communication**: REST API (JSON)

---

## How to run

### Backend（C Server）

1. **Move to the backend directory**
   ```bash
   cd backend
   ```

2. **Build with Makefile**
   ```bash
   make
   ```

3. **Start the server**
   
   **Mac/Linux:**
   ```bash
   ./server
   ```
   
   **Windows:**
   ```bash
   .\server.exe
   ```

The backend server listens on:`http://127.0.0.1:8081` 

---

### Frontend（React + Vite）

1. **Move to the frontend directory**
   ```bash
   cd frontend
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Start the development server**
   ```bash
   npm run dev
   ```

After startup, open the displayed URL in your browser (usually`http://localhost:5173`)

---

4. **How to Use**

1.Select a sorting algorithm (bubble / Gnome / Selectioin / quick, etc.)

2.Generate a random array or input an array manually

3.Press the START button

4.Watch the sorting process step-by-step or via auto play

---

## Notes

**Start the Backend before starting the Frontend**

# The frontend communicates with the backend via POST /sort (JSON)

# For browser requests, the backend supports CORS and OPTIONS (preflight requests)

---

## TestEngine

While the frontend is running with npm run dev, access /test by adding it to the URL.

Example: **http://localhost:5173/test**

---

## Features

- **Multiple sorting algorithms**
  - Bubble Sort
  - Selection Sort
  - Gnome Sort
  - Quick Sort

- **Visualizer**
  - Step-by-step playback
  - Auto play (Auto Next / Auto Back)
  - Adjustable playback speed
  - Highlighting swaps

- **Array input**
  - Random generation (1–20 elements)
  - Manual input (comma- or space-separated)
  



## Team

**Team Tetris** - se04project-std6
