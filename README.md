# Endpoints

List endpoints yang tersedia:

- `GET /`
- `GET /users`
- `POST /users/register`
- `POST /users/login`
- `DELETE /users`

Routes yang memperlukan authentication:

# 1. GET /

Deskripsi

- Untuk test apakah server sudah jalan atau belum

_Response (200 - OK)_

```json
{
  "message": "Welcome to Take Note API!"
}
```

# 2. GET /users

Deskripsi

- Mendapatkan semua data user

_Response (200 - OK)_

```json
{
  "message": "Semua User",
  "data": [
    {
      "id": "number",
      "name": "string",
      "email": "string",
      "password": "string",
      "createdAt": "date",
      "updatedAt": "date"
    },
    {
      "id": "number",
      "name": "string",
      "email": "string",
      "password": "string",
      "createdAt": "date",
      "updatedAt": "date"
    }
  ]
}
```

# 3. POST /users/register

Deskripsi

- Untuk membuat user

Request:

- body:

```json
{
  "name": "string",
  "email": "string",
  "password": "string"
}
```

_Response (201 - Created)_

```json
{
  "message": "User baru berhasil dibuat",
  "data": {
    "id": "number",
    "name": "string",
    "email": "string",
    "password": "string",
    "updatedAt": "date",
    "createdAt": "date"
  }
}
```

# 4. POST /users/login

Deskripsi

- Login user sehinga mendapatkan token

Request:

- body:

```json
{
  "email": "string",
  "password": "string"
}
```

_Response (201 - Created)_

```json
{
  "accessToken": "string"
}
```

_Response (401 - Unauthorized)_

```json
{
  "message": "Email atau password salah",
  "error": "Unauthorized",
  "statusCode": 401
}
```

# 5. DELETE /users

Deskripsi

- Untuk menhapus user

Request:

- params:

```json
{
  "id": "number (required)"
}
```

_Response (200 - OK)_

```json
{
  "message": "User berhasil dihapus"
}
```
