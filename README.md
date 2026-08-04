# TiffinHub

A full-stack MERN (MongoDB, Express.js, React.js, Node.js) web application that connects customers with local tiffin service providers. The platform allows users to browse homemade meal options, place orders, and manage their accounts through a responsive and user-friendly interface.

## Features

- User Registration & Login
- JWT Authentication
- Browse Tiffin Providers
- View Food Menu
- Add Items to Cart
- Place Orders
- Order History
- User Profile Management
- Responsive UI

## Tech Stack

### Frontend
- React.js
- Vite
- JavaScript (ES6+)
- HTML5
- CSS3
- React Router DOM
- Redux Toolkit
- React Redux
- Axios

### Backend
- Node.js
- Express.js

### Database
- MongoDB
- Mongoose

### Authentication
- JSON Web Token (JWT)
- bcrypt.js

## Project Structure

TiffinHub/
├── frontend/
│   ├── public/
│   ├── src/
│   ├── package.json
│   ├── package-lock.json
│   └── vite.config.js
│
├── backend/
│   ├── config/
│   │   └── db.js
│   ├── controllers/
│   ├── data/
│   ├── middlewares/
│   ├── models/
│   ├── routes/
│   ├── utils/
│   ├── app.js
│   ├── package.json
│   └── package-lock.json
│
├── .gitignore

## ⚙️ Installation

### Clone the Repository

git clone https://github.com/your-username/TiffinHub.git
cd TiffinHub

### Install Dependencies

#### Backend

cd backend
npm install

#### Frontend

cd frontend
npm install

## Run the Project

### Start Backend

cd backend
npm start

### Start Frontend

cd frontend
npm run dev

## Environment Variables

Create a `.env` file inside the backend folder.

PORT=5000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret

##  Author
**Moulyalakshmi K**

## 📄 License

This project is developed for educational purposes.
