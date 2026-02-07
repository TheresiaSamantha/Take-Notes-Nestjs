# Endpoints

List endpoints yang tersedia:

- `GET /`
- `GET /users`
- `POST /users`
- `DELETE /users`

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

# 3. POST /users

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

# 4. DELETE /users

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
