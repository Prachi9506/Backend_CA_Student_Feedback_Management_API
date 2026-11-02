# Student Feedback Management API

REST API built with Node.js, Express.js and MongoDB (Mongoose) to submit, retrieve and update student feedback.

## Setup
1. Start MongoDB locally, or use a MongoDB Atlas URI.
2. `cp .env.example .env` and set `MONGO_URI`
3. `npm install`
4. `npm start`

## Structure
```
config/        database connection
controllers/   request handling logic
middleware/    404 and error handling
models/        Mongoose schema
routes/        route definitions
screenshots/   API response screenshots
server.js      entry point
```

## Endpoints
| Method | URL | Description | Success |
|---|---|---|---|
| POST | /api/feedback | Submit feedback (studentName, courseName, message, rating 1-5) | 201 |
| GET | /api/feedback?page=1&limit=5 | Paginated list with currentPage, limit, totalRecords, totalPages | 200 |
| PATCH | /api/feedback/:id | Update status (`Pending` / `Reviewed`) | 200 |

Errors: 400 (validation / invalid ID / bad JSON), 404 (feedback or route not found), 500 (server error).

## Sample requests
POST body:
```json
{ "studentName": "Aarav Sharma", "courseName": "Backend Development", "message": "Great session.", "rating": 5 }
```
PATCH body:
```json
{ "status": "Reviewed" }
```