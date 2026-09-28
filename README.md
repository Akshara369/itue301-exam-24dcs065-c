# MedCare Plus

MedCare Plus is a healthcare appointment booking application that allows patients to browse doctors, book consultations, and review appointment details. The project is built with a React frontend and an Express + MongoDB backend.

## Repository structure

itue301-exam-[roll-number]-[batch]/
├── frontend/
│   ├── src/
│   └── package.json
├── backend/
│   ├── models/
│   ├── server.js
│   └── package.json
├── .env.example
├── .gitignore
└── README.md

## 1. Frontend setup

1. Open a terminal in the project root.
2. Install frontend dependencies:

```bash
cd frontend
npm install
```

3. Run the frontend app:

```bash
npm run dev
```

The frontend usually runs at:

```text
http://localhost:5173
```

## 2. Backend setup

1. Open a new terminal.
2. Install backend dependencies:

```bash
cd backend
npm install
```

3. Create a `.env` file in the `backend` folder by copying the example file:

```bash
copy ../.env.example .env
```

4. Start the backend server:

```bash
npm start
```

The backend usually runs at:

```text
http://localhost:5000
```

## 3. MongoDB setup

1. Install MongoDB locally or use a MongoDB Atlas cloud database.
2. Start MongoDB on your machine.
3. Make sure the connection string points to your database instance.

Example local connection:

```env
MONGO_URI=mongodb://localhost:27017/medcareplus
```

## 4. Required environment variables

Create a `.env` file in the `backend` folder with the following values:

```env
PORT=5000
MONGO_URI=mongodb://localhost:27017/medcareplus
```

You can also copy the sample values from `.env.example` in the project root.

## 5. Run the app

- Start MongoDB.
- Start the backend using `npm start` inside `backend/`.
- Start the frontend using `npm run dev` inside `frontend/`.
- Open the frontend URL in the browser and use the app.
