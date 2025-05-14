# Wallet Endpoints

## POST /wallet/transfer

### Purpose:

Transfers funds between two user accounts. Can include currency conversion if accounts use different currencies.

### Authorization:

- Authorization Token Required

### Request Format:

```http
PATCH /api/v1/wallet/transfer
```

### Request Headers:

```http
x-auth-token: <your_jwt_token>
Content-Type: application/json
```

### Request Body Parameters:

| Parameter     | Type   | Required | Description                               |
| ------------- | ------ | -------- | ----------------------------------------- |
| accountNumber | string | Yes      | Sender’s account number                   |
| amount        | string | Yes      | Amount to transfer (in sender’s currency) |
| recipient     | string | Yes      | Recipient’s account number                |
| fee           | string | No       | Optional transaction fee (percentage)     |
| reference     | string | No       | Optional transaction reference            |

#### Example Request:

```json
{
  "accountNumber": "ACC-123456",
  "amount": 200,
  "recipient": "ACC-789012",
  "fee": 2,
  "reference": "Rent Payment"
}
```

#### Responses

##### Success (200 OK)

```json
{
  "message": "Funds transferred successfully",
  "data": {
    "senderTxn": {
      "id": "txn_sender_123",
      "accountId": "account_sender_456",
      "amount": -105.0,
      "fee": 5.0,
      "transactionType": "TRANSFER",
      "status": "COMPLETED",
      "createdAt": "2025-05-14T12:00:00.000Z",
      "completedAt": "2025-05-14T12:00:00.000Z",
      "direction": "OUTGOING",
      "reference": "Invoice #45678",
      "transferGroupId": "550e8400-e29b-41d4-a716-446655440000"
    },
    "recipientTxn": {
      "id": "txn_recipient_789",
      "accountId": "account_recipient_987",
      "amount": 100.0,
      "fee": 0,
      "transactionType": "TRANSFER",
      "status": "COMPLETED",
      "createdAt": "2025-05-14T12:00:00.000Z",
      "completedAt": "2025-05-14T12:00:00.000Z",
      "direction": "INCOMING",
      "reference": "Invoice #45678",
      "transferGroupId": "550e8400-e29b-41d4-a716-446655440000"
    }
  }
}
```

##### Error Responses:

- 401 Unauthorized
  - Invalid or missing authentication token
- 404 Not Found
  - Sender or recipient account not found
  - Currency exchange rate not found (for different currencies)
- 400 Bad Request
  - Amount too low
  - Self-transfer attempted
  - Insufficient balance
  - Deleted account(s)

## POST /wallet/transfer/internal

### Purpose:

Transfers funds between a user’s own accounts (same userId, same or different currencies).

### Authorization:

- Authorization Token Required

### Request Format:

```http
PATCH /api/v1/wallet/transfer/internal
```

### Request Headers:

```http
x-auth-token: <your_jwt_token>
Content-Type: application/json
```

### Request Body Parameters:

| Parameter     | Type   | Required | Description                               |
| ------------- | ------ | -------- | ----------------------------------------- |
| accountNumber | string | Yes      | Sender’s account number                   |
| amount        | string | Yes      | Amount to transfer (in sender’s currency) |
| recipient     | string | Yes      | Recipient’s account number                |
| fee           | string | No       | Optional transaction fee (percentage)     |
| reference     | string | No       | Optional transaction reference            |

#### Example Request:

```json
{
  "accountNumber": "ACC-123456",
  "amount": 200,
  "recipient": "ACC-654321",
  "fee": 2,
  "reference": "Rent Payment"
}
```

#### Responses

##### Success (200 OK)

```json
{
  "message": "Funds transferred successfully",
  "data": {
    "senderTxn": {
      "id": "txn_sender_123",
      "accountNumber": "ACC-123456",
      "amount": -105.0,
      "fee": 5.0,
      "transactionType": "TRANSFER_INTERNAL",
      "status": "COMPLETED",
      "createdAt": "2025-05-14T12:00:00.000Z",
      "completedAt": "2025-05-14T12:00:00.000Z",
      "direction": "OUTGOING",
      "reference": "Invoice #45678",
      "transferGroupId": "550e8400-e29b-41d4-a716-446655440000"
    },
    "recipientTxn": {
      "id": "txn_recipient_789",
      "recipient": "ACC-654321",
      "amount": 100.0,
      "fee": 0,
      "transactionType": "TRANSFER_INTERNAL",
      "status": "COMPLETED",
      "createdAt": "2025-05-14T12:00:00.000Z",
      "completedAt": "2025-05-14T12:00:00.000Z",
      "direction": "INCOMING",
      "reference": "Invoice #45678",
      "transferGroupId": "550e8400-e29b-41d4-a716-446655440000"
    }
  }
}
```

##### Error Responses:

- 401 Unauthorized
  - Invalid or missing authentication token
- 404 Not Found
  - Sender or recipient account not found
  - Currency exchange rate not found (for different currencies)
- 400 Bad Request
  - Amount too low
  - Self-transfer attempted
  - Insufficient balance
  - Deleted account(s)

## POST /wallet/fund

### Purpose:

Initiates a deposit to a user’s account. Status will initially be PENDING.

### Authorization:

- Authorization Token Required

### Request Format:

```http
PATCH /api/v1/wallet/fund
```

### Request Headers:

```http
x-auth-token: <your_jwt_token>
Content-Type: application/json
```

### Request Body Parameters:

| Parameter     | Type   | Required | Description                           |
| ------------- | ------ | -------- | ------------------------------------- |
| accountNumber | string | Yes      | Target account number                 |
| amount        | string | Yes      | Amount to fund                        |
| fee           | string | No       | Optional transaction fee (percentage) |
| reference     | string | No       | Optional transaction reference        |

#### Example Request:

```json
{
  "accountNumber": "ACC-123456",
  "amount": 1000,
  "fee": 1,
  "reference": "Top-up"
}
```

#### Responses

##### Success (200 OK)

```json
{
  "message": "Account funded successfully",
  "data": {
    "id": "txn_id",
    "status": "PENDING"
  }
}
```

##### Error Responses:

- 401 Unauthorized
  - Invalid or missing authentication token

## PATH /wallet/fund/:id

### Purpose:

(Webhook) Updates the status of a pending deposit. Used to confirm or reject the deposit.

### Authorization:

- Authorization Token Required

### Request Format:

```http
PATH /api/v1/wallet/fund/:id
```

### Request Headers:

```http
x-auth-token: <your_jwt_token>
Content-Type: application/json
```

### Path Parameters:

| Parameter     | Type   | Description    |
| ------------- | ------ | -------------- |
| accountNumber | string | Transaction ID |

### Request Body Parameters:

| Parameter | Type   | Required | Description                      |
| --------- | ------ | -------- | -------------------------------- |
| status    | string | Yes      | SUCCESS or FAILED                |
| amount    | string | Yes      | Final confirmed amount to update |

#### Example Request:

```json
{
  "status": "SUCCESS",
  "amount": 1000
}
```

#### Responses

##### Success (200 OK)

```json
{
  "message": "Funding updated successfully",
  "data": {
    "id": "txn_id",
    "status": "SUCCESS",
    ...
  }
}
```

##### Error Responses:

- 401 Unauthorized
  - Invalid or missing authentication token
- 404 Not Found
  - Account or transaction not found
- 400 Bad Request
  - Invalid status
  - Transaction not in PENDING state

## GET /wallet/:accountNumber/balance

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

## GET /wallet/:accountNumber/history

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

## DELETE /wallet/:accountNumber

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
