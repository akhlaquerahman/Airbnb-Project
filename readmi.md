# 🌍 Wonderlust - Travel Airbnb similar Web App

Wonderlust is a full-stack travel listing web application that allows users to create, view, edit, and delete beautiful travel destination listings. Built using Node.js, Express.js, MongoDB, and EJS, this app is perfect for learning how real-world full-stack web apps are structured and function.

## ✨ Features

- 🔐 User Authentication with Passport.js
- 📍 Location maps using Leaflet.js
- 📸 Image uploads for each listing
- 📝 Add, Edit, and Delete listings
- 💬 Reviews and Ratings (basic)
- 🎨 Responsive and mobile-friendly UI with Bootstrap
- 🔒 Secure session management with cookies and MongoDB store
- ⚠️ Flash messages for feedback (success/error)

## 🚀 Live Preview

https://airbnb-project-ugg6.onrender.com

## 📁 Project Structure


## 🧰 Tech Stack

- **Backend**: Node.js, Express.js
- **Frontend**: HTML, EJS, Bootstrap, Leaflet.js
- **Database**: MongoDB with Mongoose
- **Authentication**: Passport.js (Local Strategy)
- **Other Tools**: Multer (file uploads), Cloudinary (optional for image hosting), Connect-Flash, MongoStore

---

## 🔧 Installation

### Prerequisites:
- Node.js and npm installed
- MongoDB Atlas account and cluster
- Cloudinary account (optional for image hosting)

### Steps:

1. **Clone the repo:**

```bash
git clone https://github.com/akhlaquerahman/Airbnb-Project.git
cd Airbnb-Project
Install dependencies:


npm install
Create a .env file in the root directory:


ATLASDB_URL=your_mongodb_connection_string
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_KEY=your_cloud_key
CLOUDINARY_SECRET=your_cloud_secret
SECRET=anyrandomsecret
Run the server:


node app.js
Visit http://localhost:8080 in your browser to get started.

🛠️ Usage
Register a new account

Create a new travel listing with image and location

View all listings on the homepage

Edit or delete your own listings

Add reviews to listings

📷 Screenshots
Add screenshots of Home Page, Listing Form, and Show Page here (optional)

🧠 Learnings
This project helped me understand:

MVC structure in Express apps

RESTful routes and CRUD operations

Authentication and session handling

File upload and image handling with Multer and Cloudinary

How to structure a scalable backend project

🙌 Acknowledgements
Bootstrap for responsive UI

Leaflet.js for map rendering

Colt Steele's Web Developer Bootcamp (for learning inspiration)


📫 Contact
If you found this project useful or want to collaborate, feel free to reach out:

Name: Akhlaque Rahman
