# Endpoints

List endpoints yang tersedia:

- `GET /`
- `GET /users`
- `POST /users/register`
- `POST /users/login`
- `DELETE /users/:id`

Routes yang memperlukan authentication:

- `GET /notes`
- `GET /notes/:id`
- `POST /notes`
- `PUT /notes/:id`
- `DELETE /notes/:id`

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

# 5. DELETE /users/:id

Deskripsi

- Untuk menghapus user

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

---

# Notes Endpoints (Protected)

**Semua endpoint notes memerlukan authentication (JWT Token).**

Request Header:

```json
{
  "Authorization": "Bearer <accessToken>"
}
```

# 6. GET /notes

Deskripsi

- Mendapatkan semua notes milik user yang sedang login
- Notes otomatis difilter berdasarkan userId dari JWT token

_Response (200 - OK)_

```json
[
  {
    "id": "number",
    "title": "string",
    "content": "string",
    "userId": "number",
    "createdAt": "date",
    "updatedAt": "date",
    "User": {
      "id": "number",
      "name": "string",
      "email": "string"
    }
  }
]
```

_Response (401 - Unauthorized)_

```json
{
  "message": "Token tidak ditemukan",
  "error": "Unauthorized",
  "statusCode": 401
}
```

# 7. GET /notes/:id

Deskripsi

- Mendapatkan detail note berdasarkan id
- User hanya bisa melihat note miliknya sendiri

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
  "id": "number",
  "title": "string",
  "content": "string",
  "userId": "number",
  "createdAt": "date",
  "updatedAt": "date",
  "User": {
    "id": "number",
    "name": "string",
    "email": "string"
  }
}
```

_Response (403 - Forbidden)_

```json
{
  "message": "You can only view your own notes",
  "error": "Forbidden",
  "statusCode": 403
}
```

# 8. POST /notes

Deskripsi

- Membuat note baru
- userId otomatis diambil dari JWT token, tidak perlu dikirim di body

Request:

- body:

```json
{
  "title": "string",
  "content": "string"
}
```

_Response (201 - Created)_

```json
{
  "id": "number",
  "title": "string",
  "content": "string",
  "userId": "number",
  "createdAt": "date",
  "updatedAt": "date"
}
```

_Response (401 - Unauthorized)_

```json
{
  "message": "Token tidak valid",
  "error": "Unauthorized",
  "statusCode": 401
}
```

# 9. PUT /notes/:id

Deskripsi

- Update note berdasarkan id
- User hanya bisa update note miliknya sendiri

Request:

- params:

```json
{
  "id": "number (required)"
}
```

- body:

```json
{
  "title": "string (optional)",
  "content": "string (optional)"
}
```

_Response (200 - OK)_

```json
{
  "affected": "number",
  "data": [
    {
      "id": "number",
      "title": "string",
      "content": "string",
      "userId": "number",
      "createdAt": "date",
      "updatedAt": "date"
    }
  ]
}
```

_Response (403 - Forbidden)_

```json
{
  "message": "You can only update your own notes",
  "error": "Forbidden",
  "statusCode": 403
}
```

# 10. DELETE /notes/:id

Deskripsi

- Menghapus note berdasarkan id
- User hanya bisa menghapus note miliknya sendiri

Request:

- params:

```json
{
  "id": "number (required)"
}
```

_Response (204 - No Content)_

```
(No body returned)
```

_Response (403 - Forbidden)_

```json
{
  "message": "You can only delete your own notes",
  "error": "Forbidden",
  "statusCode": 403
}
```

_Response (404 - Not Found)_

```json
{
  "message": "Note not found",
  "error": "Forbidden",
  "statusCode": 403
}
```
