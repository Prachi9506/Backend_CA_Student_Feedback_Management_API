# Student Feedback Management API

Node.js + Express.js + MongoDB (Mongoose)

## Setup
1. Install Node.js and start MongoDB locally (or put your Atlas URI in `.env`).
2. `npm install`
3. `npm start`  ->  "MongoDB connected" and "Server running on http://localhost:5000"

## Project structure
```
server.js
.env
models/Feedback.js
routes/feedback.js
```

## Tests to run in Postman / Thunder Client (take a screenshot of each)

### 1. POST /api/feedback  (success)  -> 201
Body (JSON):
{ "studentName": "Aarav Sharma", "courseName": "Backend Development", "message": "Great session, very practical.", "rating": 5 }

Expected:
{ "success": true, "message": "Feedback submitted successfully",
  "data": { "studentName": "Aarav Sharma", "courseName": "Backend Development",
            "message": "Great session, very practical.", "rating": 5, "status": "Pending",
            "_id": "<id>", "createdAt": "...", "updatedAt": "...", "__v": 0 } }

### 2. POST /api/feedback  (missing field) -> 400
Body: { "studentName": "Aarav Sharma", "rating": 4 }
Expected: { "success": false, "error": "Missing required field(s): courseName, message" }

### 3. POST /api/feedback  (invalid rating) -> 400
Body: { "studentName": "A", "courseName": "B", "message": "C", "rating": 7 }
Expected: { "success": false, "error": "rating must be a number between 1 and 5" }

(Add 4-6 more records first so pagination is visible.)

### 4. GET /api/feedback?page=1&limit=3 -> 200
Expected (with 7 records saved):
{ "success": true, "currentPage": 1, "limit": 3, "totalRecords": 7, "totalPages": 3, "data": [ ...3 records... ] }

### 5. GET /api/feedback?page=3&limit=3 -> 200   (last page, 1 record)

### 6. PATCH /api/feedback/<id from step 1>  -> 200
Body: { "status": "Reviewed" }
Expected: { "success": true, "message": "Feedback status updated successfully", "data": { ..., "status": "Reviewed" } }

### 7. PATCH with a valid-format but non-existing ID -> 404
URL: /api/feedback/64b7f0f0f0f0f0f0f0f0f0f0   Body: { "status": "Reviewed" }
Expected: { "success": false, "error": "Feedback not found" }

### 8. PATCH with invalid ID or invalid status -> 400
URL: /api/feedback/123  -> { "success": false, "error": "Invalid feedback ID" }
Body: { "status": "Done" } -> { "success": false, "error": "status must be either 'Pending' or 'Reviewed'" }

## Rubric mapping
- Schema/model + submission: models/Feedback.js, POST route
- Pagination with skip()/limit(): GET route
- Metadata and total count: currentPage, limit, totalRecords, totalPages
- Status update by ID: PATCH route
- Status codes / error handling: 201, 200, 400, 404, 500 handled throughout
