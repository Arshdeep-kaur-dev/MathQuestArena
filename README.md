MathQuest Arena

A gamified mathematics learning platform for Class 6 NCERT students.

Live Website: https://mathquest-arena.vercel.app

About:
MathQuest Arena makes learning mathematics fun by combining video lessons, reading notes, quizzes, coins, badges, leaderboard, and an AI Math Tutor — all in one place.

This is my MCA Final Year Project at Guru Nanak Dev University, Amritsar.

Developer: Arshdeep Kaur

Features:
14 NCERT Class 6 chapters with video lessons and reading notes
280 quiz questions (Easy and Hard levels)
173 curated YouTube videos with playlist UI
Coins system — Easy pass gives 5 coins, Hard pass gives 10 coins
7 achievement badges
Leaderboard showing top 10 students
Personal notes — add, edit, delete
AI Math Tutor powered by Groq API
Sign in with Google (Google OAuth)
Mobile responsive design
JWT Authentication

TECH STACK:

Frontend:
React 19
React Router 7
Axios
Vite

Backend:
Python 3.11
Django 4.2.7
Django REST Framework
SimpleJWT

Database:
PostgreSQL (hosted on Supabase)

Other:
Groq API (AI Tutor)
Google OAuth 2.0
Vercel (Frontend hosting)
Render (Backend hosting)

How to Run Locally:

Requirements:
Python 3.11+
Node.js 18+

Backend:
bashcd backend
python -m venv .venv
.venv\Scripts\activate
pip install -r requirements.txt
python manage.py migrate
python manage.py loaddata fixtures/data.json
python manage.py runserver

Frontend:
bashcd frontend
npm install
npm run dev
Open http://localhost:5173 in your browser.
Admin Panel: http://localhost:8000/admin

Database:
9 tables with 322 pre-loaded objects:
14 Chapters
28 Lessons
280 Questions
173 Chapter Videos
7 Badges

API Endpoints:

Method        URL                        Description
POST        /api/register/            Register new user
POST        /api/login/               Login
POST        /api/auth/google/         Google login
POST        /api/logout/              Logout
GET        /api/chapters /            All chapters
GET        /api/quiz/id/difficulty/   Quiz questions
POST       /api/quiz/submit/          Submit quiz
GET        /api/leaderboard/          Top 10 students
GET        /POST/api/notes/           Notes
POST       /api/ai-tutor /            AI Tutor

Security:
JWT tokens for authentication
Google OAuth 2.0
Password hashing
CORS protection
Environment variables for secret keys

Future Plans:
Add Classes 7 to 10
Email verification
Video progress tracking
Parent dashboard

Made with love for Class 6 students | GNDU Amritsar | 2025-26
