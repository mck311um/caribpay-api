# Authentication Endpoints

## POST /auth/register

### Purpose:

This endpoint is used to register a new user by providing the necessary user details

#### Request Format:

```http
POST /api/v1/auth/register
Content-Type: application/json
```

```json
{
  "email": "testuser@example.com",
  "password": "SecurePass123!",
  "firstName": "Test",
  "lastName": "User",
  "phone": "+18761234567"
}
```

#### Response

```json
{
  "token": "your_jwt_token",
  "userData": {
    "id": "user_id",
    "email": "testuser@example.com",
    "fullName": "Test User",
    "firstName": "Test",
    "lastName": "User",
    "phone": "+18761234567"
  }
}
```
