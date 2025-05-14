# User Endpoints

## patch /user/update

### Purpose:

Updates user profile information and creates a primary account for the user in their selected country's currency.

### Authorization:

- Authorization Token Required

### Request Format:

```http
PATCH /api/v1/user/update/
```

### Request Headers:

```http
x-auth-token: <your_jwt_token>
Content-Type: application/json
```

### Request Body Parameters:

| Parameter     | Type   | Required | Description                                                                 |
| ------------- | ------ | -------- | --------------------------------------------------------------------------- |
| dateOfBirth   | string | Yes      | User's date of birth in YYYY-MM-DD format                                   |
| nationality   | string | Yes      | User's nationality                                                          |
| idType        | string | Yes      | Type of identification (e.g., 'PASSPORT', 'DRIVERS_LICENSE', 'NATIONAL_ID') |
| idNumber      | string | Yes      | Identification document number                                              |
| idDocumentUrl | string | Yes      | URL to uploaded identification document                                     |
| addressLine1  | string | Yes      | Primary address line                                                        |
| addressLine2  | string | Yes      | Secondary address line                                                      |
| city          | string | Yes      | City of residence                                                           |
| countryId     | string | Yes      | UUID of the country where user resides                                      |

#### Example Request:

```json
{
  "dateOfBirth": "1990-01-01",
  "nationality": "Testian",
  "idType": "PASSPORT",
  "idNumber": "A1234567",
  "idDocumentUrl": "http://example.com/doc.png",
  "addressLine1": "123 Main St",
  "addressLine2": "Suite 4",
  "city": "Testville",
  "countryId": "a1b2c3d4-e5f6-7890-g1h2-i3j4k5l6m7n8"
}
```

#### Responses

##### Success (200 OK)

```json
{
  "id": "user_id",
  "email": "user@example.com",
  "firstName": "John",
  "lastName": "Doe",
  "phone": "+1234567890",
  "dateOfBirth": "1990-01-01T00:00:00.000Z",
  "nationality": "Testian",
  "idType": "PASSPORT",
  "idNumber": "A1234567",
  "addressLine1": "123 Main St",
  "addressLine2": "Suite 4",
  "city": "Testville",
  "countryId": "a1b2c3d4-e5f6-7890-g1h2-i3j4k5l6m7n8"
}
```

##### Error Responses:

- 401 Unauthorized
  Invalid or missing authentication token
- 404 Not Found
  - User not found
  ```json
  { "message": "User not found" }
  ```
  - Country not supported
  ```json
  { "message": "Country not supported" }
  ```
- 400 Bad Request
  Validation errors or missing required fields
