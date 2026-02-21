# ✅ TaskMaster - Secure Full-Stack Task Management App

TaskMaster is a modern, full-stack web application that allows users to organize their daily and long-term goals. It features dynamic progress tracking, gamification elements (confetti animations), and robust backend security protocols.

![TaskMaster Screenshot](https://i.hizliresim.com/azqdgks.png)

🚀 **Live Demo:** [Check out TaskMaster](https://taskmaster-xuo5.onrender.com)

## 🎯 Key Features
* **Secure Authentication:** JWT-based user authentication and session management.
* **Smart Categorization:** Separate your goals into "Daily Tasks" and "Long-Term Tasks".
* **Dynamic Progress Bar:** Real-time visual feedback based on completed daily tasks.
* **Gamification:** Triggers a confetti animation upon completing all daily tasks to boost productivity.
* **Dark/Light Theme:** User-preferred UI theme stored securely in local storage.
* **Bulk Actions:** Reset all daily tasks with a single click.
* **Fully Responsive:** Optimized for mobile, tablet, and desktop screens.

## 🛡️ Security Implementations (Security First Approach)
* **JWT (JSON Web Token):** Stateless and secure route protection preventing IDOR vulnerabilities.
* **Rate Limiting:** Protects authentication routes (Login/Register) against Brute-Force and DDoS attacks.
* **Password Cryptography:** User passwords are hashed using **Bcrypt** before database insertion.
* **SQL Injection Protection:** Utilizing parameterized queries (`db.execute`) for all database transactions.
* **Helmet & CSP:** Configured Content Security Policy to mitigate XSS (Cross-Site Scripting) attacks.

## 🛠️ Tech Stack

**Frontend (Client):**
* HTML5, CSS3, Vanilla JavaScript (ES6+)
* Bootstrap 5.3 (UI & Grid System)
* Toastify.js (Dynamic Notifications)
* Canvas Confetti (Animations)

**Backend (Server) & Database:**
* Node.js & Express.js (RESTful API)
* MySQL (Hosted on Aiven Cloud)
* JSON Web Token (JWT)
* express-rate-limit & Helmet

## ⚙️ Local Installation

To run this project locally on your machine, follow these steps:

1. Clone the repository:
   ```bash
   git clone [https://github.com/YOUR_USERNAME/taskmaster.git](https://github.com/YOUR_USERNAME/taskmaster.git)

2. Navigate to the project directory and install dependencies:
   ```bash
   cd taskmaster
   npm install

3. Create a **.env** file in the root directory and configure your environment variables:
   ```snippet
   DB_HOST=localhost
   DB_USER=root
   DB_PASSWORD=your_password
   DB_NAME=todo_app
   PORT=3000
   JWT_SECRET=your_super_secret_jwt_key

4. Execute the SQL scripts located in the project to create users and tasks tables in your database.

5. Start the development server:
   ```bash
   npm run dev

## 👨‍💻 Developer
**Kadir Gündüz**

**Linkedin:** (https://www.linkedin.com/in/kadir-gündüz-a50a67325)
