# Assignment Submission

This is a backend system for an assignment submission portal where users can upload assignments and admins can review, accept, or reject them.

## Features

- **User Authentication**: Users and admins can register and log in.
- **Upload Assignments**: Users can upload assignments that will be tagged to a specific admin.
- **Admin Assignment Review**: Admins can view assignments tagged to them and either accept or reject them.
- **Role-Based Access Control**: Separate endpoints for users and admins.
- **MongoDB**: Used as the database to store users, admins, and assignments.

## Tech Stack

- **Backend**: Node.js, Express.js
- **Database**: MongoDB
- **Authentication**: JWT (JSON Web Token)
- **Environment Variables**: Managed using dotenv
- **Error Handling**: Custom error handlers

## Requirements

- **Node.js** (v12+)
- **MongoDB** (v4+)
- **Postman or any API testing tool** for testing endpoints

## Getting Started

### 1. Clone the Repository

```bash
git clone https://github.com/mdparvez6/Assignment_Submission
cd assignment-portal
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Set Up Environment Variables

Create a `.env` file in the root directory of the project and add the following:

```env
PORT=5000
MONGO_URI=your-mongodb-connection-string
JWT_SECRET=your-jwt-secret
```

### 4. Run the Server

```bash
npm start
```

The server will start on `http://localhost:5000`.

### 5. API Endpoints and JWT Usage

JWT tokens are generated upon user or admin login. These tokens need to be included in the `Authorization` header of all requests to protected routes. The format should be:

```bash
Authorization: Bearer <your_jwt_token>
```

#### **User Endpoints**

1. **Register a new user**

   - **URL**: `/user/register`
   - **Method**: `POST`
   - **Request Body**:
     ```json
     {
       "username": "JohnDoe",
       "password": "password123"
     }
     ```

2. **User Login**

   - **URL**: `/user/login`
   - **Method**: `POST`
   - **Request Body**:
     ```json
     {
       "username": "JohnDoe",
       "password": "password123"
     }
     ```

   - **Response**: A JWT token is returned, which should be used in all further user-specific requests.

   - **Example** Response:
     ```json
     {
       "statusCode": 200,
       "data": { "user": "JohnDoe" },
       "token": "your_generated_jwt_token",
       "message": "User logged In Successfully",
       "success": true
     }
     ```

   - **Use the returned token in the following requests**:

3. **Upload an Assignment (Requires JWT Token)**

   - **URL**: `/user/upload`
   - **Method**: `POST`
   - **Headers**: Authorization `Bearer <JWT Token>`
   - **Request Body**:
     ```json
     {
       "task": "Complete the project",
       "adminId": "admin-object-id"
     }
     ```

4. **Fetch all Admins (Requires JWT Token)**

   - **URL**: `/user/admins`
   - **Method**: `GET`
   - **Headers**: Authorization `Bearer <JWT Token>`

#### **Admin Endpoints**

1. **Register a new admin**

   - **URL**: `/admin/register`
   - **Method**: `POST`
   - **Request Body**:
     ```json
     {
       "username": "AdminName",
       "password": "adminPassword"
     }
     ```

2. **Admin Login**

   - **URL**: `/admin/login`
   - **Method**: `POST`
   - **Request Body**:
     ```json
     {
       "username": "AdminName",
       "password": "adminPassword"
     }
     ```

   - **Response**: A JWT token is returned, which should be used in all further admin-specific requests.

   - **Example** Response:
     ```json
     {
       "statusCode": 200,
       "data": { "admin": "AdminName" },
       "token": "your_generated_jwt_token",
       "message": "Admin logged In Successfully",
       "success": true
     }
     ```

   - **Use the returned token in the following requests**:

3. **View Assignments Tagged to Admin (Requires JWT Token)**

   - **URL**: `/admin/assignments`
   - **Method**: `GET`
   - **Headers**: Authorization `Bearer <JWT Token>`

   This will fetch all assignments tagged to the logged-in admin.

4. **Accept Assignment (Requires JWT Token)**

   - **URL**: `/admin/assignments/:id/accept`
   - **Method**: `POST`
   - **Headers**: Authorization `Bearer <JWT Token>`
   - **Parameters**: `id` is the assignment ID that needs to be accepted.

5. **Reject Assignment (Requires JWT Token)**

   - **URL**: `/admin/assignments/:id/reject`
   - **Method**: `POST`
   - **Headers**: Authorization `Bearer <JWT Token>`
   - **Parameters**: `id` is the assignment ID that needs to be rejected.

### 6. Error Handling

All errors are returned in the following format:

```json
{
  "statusCode": 400,
  "message": "Error message",
  "success": false
}
```

### 7. Sample Data Models

#### **User Schema**

```javascript
const userSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: { type: String, enum: ['user', 'admin'], default: 'user' }
});
```

#### **Assignment Schema**

```javascript
const assignmentSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  task: { type: String, required: true },
  adminId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  status: { type: String, enum: ['Pending', 'Accepted', 'Rejected'], default: 'Pending' },
  submissionTime: { type: Date, default: Date.now }
});
```

### 8. JWT Authentication

JWT tokens are used to authenticate users and admins. Include the token in the `Authorization` header when making requests to protected routes.

```bash
Authorization: Bearer <your_jwt_token>
```

### 9. Project Structure

```bash
├── controllers
│   ├── adminController.js
│   └── userController.js
├── db
│   ├── index.js
├── middleware
│   ├── authMiddleware.js
├── models
│   ├── assignmentModel.js
│   └── userModel.js
├── Routes
│   ├── adminRoutes.js
│   └── userRoutes.js
├── utils
│   ├── ApiError.js
│   ├── ApiResponse.js
│   └── asyncHandler.js
├── .env
├── index.js
├── constants.js
└── package.json
```
