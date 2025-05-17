# Wallet Endpoints

## GET /account/:accountNumber/balance

### Purpose:

Returns the current balance of a specific account.

### Authorization:

- Authorization Token Required

### Request Format:

```http
GET /api/v1/wallet/:accountNumber/balance
```

### Request Headers:

```http
x-auth-token: <your_jwt_token>
Content-Type: application/json
```

### Path Parameters:

| Parameter     | Type   | Description                                                  |
| ------------- | ------ | ------------------------------------------------------------ |
| accountNumber | string | The account number for which to retrieve transaction history |

#### Responses

##### Success (200 OK)

```json
{
  "message": "Wallet balance retrieved successfully",
  "data": {
    "balance": 500.75
  }
}
```

##### Error Responses:

- 401 Unauthorized
  - Invalid or missing authentication token

## GET /account/:accountNumber/history

### Purpose:

Get a list of transactions for a specific account belonging to the authenticated user.

### Authorization:

- Authorization Token Required

### Request Format:

```http
GET /api/v1/wallet/:accountNumber/history
```

### Request Headers:

```http
x-auth-token: <your_jwt_token>
Content-Type: application/json
```

### Path Parameters:

| Parameter     | Type   | Description                                                  |
| ------------- | ------ | ------------------------------------------------------------ |
| accountNumber | string | The account number for which to retrieve transaction history |

### Query Parameters:

| Parameter | Type   | Description                                           |
| --------- | ------ | ----------------------------------------------------- |
| limit     | number | Number of transactions to return (default: 20)        |
| offset    | number | Number of records to skip for pagination (default: 0) |

#### Responses

##### Success (200 OK)

```json
{
  "message": "Transaction history retrieved successfully",
  "data": [
    {
      "id": "string",
      "accountId": "string",
      "amount": 100,
      "fee": 0,
      "transactionType": "TRANSFER",
      "status": "COMPLETED",
      "createdAt": "2025-05-14T00:00:00.000Z",
      "direction": "INCOMING",
      ...
    },
    ...
  ]
}
```

##### Error Responses:

- 401 Unauthorized
  - Invalid or missing authentication token

## DELETE /account/:accountNumber

### Purpose:

Marks the user’s account as deleted. Only possible if balance is 0 and account is not primary.

### Authorization:

- Authorization Token Required

### Request Format:

```http
DELETE /api/v1/wallet/:accountNumber
```

### Request Headers:

```http
x-auth-token: <your_jwt_token>
Content-Type: application/json
```

### Path Parameters:

| Parameter     | Type   | Description                                                  |
| ------------- | ------ | ------------------------------------------------------------ |
| accountNumber | string | The account number for which to retrieve transaction history |

### Query Parameters:

| Parameter | Type   | Description                                           |
| --------- | ------ | ----------------------------------------------------- |
| limit     | number | Number of transactions to return (default: 20)        |
| offset    | number | Number of records to skip for pagination (default: 0) |

#### Responses

##### Success (200 OK)

```json
{
  "message": "Account deleted successfully"
}
```

##### Error Responses:

- 401 Unauthorized
  - Invalid or missing authentication token
