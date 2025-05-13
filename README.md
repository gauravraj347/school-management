# School Management API

A Node.js API for managing school data, allowing users to add new schools and retrieve a list of schools sorted by proximity to a user-specified location.

## Features

- Add new schools with name, address, and geographical coordinates
- List schools sorted by proximity to a user-specified location
- MySQL database integration
- RESTful API design

## Prerequisites

- Node.js (v14 or higher)
- MySQL Server
- npm (Node Package Manager)

## Installation

1. Clone the repository
2. Navigate to the project directory
3. Install dependencies:
   ```
   npm install
   ```
4. Configure environment variables:
   - Rename `.env.example` to `.env` (if applicable)
   - Update the database credentials in the `.env` file

## Database Setup

The application will automatically:
- Create the database if it doesn't exist
- Create the required tables with the necessary fields

## Running the Application

### Development Mode
```
npm run dev
```

### Production Mode
```
npm start
```

## API Endpoints

### Add School
- **Endpoint**: `/api/addSchool`
- **Method**: POST
- **Payload**:
  ```json
  {
    "name": "School Name",
    "address": "School Address",
    "latitude": 12.345678,
    "longitude": 98.765432
  }
  ```
- **Response**:
  ```json
  {
    "success": true,
    "message": "School added successfully",
    "data": {
      "id": 1,
      "name": "School Name",
      "address": "School Address",
      "latitude": 12.345678,
      "longitude": 98.765432
    }
  }
  ```

### List Schools
- **Endpoint**: `/api/listSchools`
- **Method**: GET
- **Parameters**:
  - `latitude`: User's latitude
  - `longitude`: User's longitude
- **Example**: `/api/listSchools?latitude=12.345678&longitude=98.765432`
- **Response**:
  ```json
  {
    "success": true,
    "count": 2,
    "data": [
      {
        "id": 1,
        "name": "School Name",
        "address": "School Address",
        "latitude": 12.345678,
        "longitude": 98.765432,
        "distance": 0.0
      },
      {
        "id": 2,
        "name": "Another School",
        "address": "Another Address",
        "latitude": 12.355678,
        "longitude": 98.775432,
        "distance": 1.5
      }
    ]
  }
  ```

## Postman Collection

A Postman collection is available for testing the API endpoints. Import the collection from the `postman` directory.

## License

ISC
