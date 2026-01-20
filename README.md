# 🥗 Nutriplan (DietMenuProject)

**Nutriplan** is an intelligent web-based system for automatically generating optimized daily meal plans.  
The project combines **mathematical optimization algorithms** with **modern web technologies** to balance nutrients, respect user constraints, and provide a smooth, interactive user experience.

---

## 🛠 Tech Stack

### Backend 
- **Language:** Python 3.11  
- **Framework:** Django, Django REST Framework (DRF)  
- **Database:** PostgreSQL  
- **API Docs:** Swagger

### Frontend 
- **Framework:** React.js  
- **Routing:** React Router v6  
- **HTTP Client:** Axios  

### Infrastructure
- **Containerization:** Docker, Docker Compose  
- **Version Control:** Git  

---

## 🚀 Installation & Setup

The project consists of two main parts: **backend** and **frontend**.

## 1.️ Run Backend (Docker — Recommended)

cd backend  
docker-compose up --build -d

Apply database migrations:  
docker-compose exec web python manage.py migrate

Create a superuser:  
docker-compose exec web python manage.py createsuperuser

### Service URLs
API: http://localhost:8000  
Swagger Docs: http://localhost:8000/api/docs/  
Admin Panel: http://localhost:8000/admin/  


## 2️. Run Frontend (Local Development)

cd frontend  
npm install  
npm start  

Web App: http://localhost:3000

---

## 🧪 Useful Commands

View logs:  
docker-compose logs -f web

Stop services:  
docker-compose down
