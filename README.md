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

---

# Architecture & Design Patterns

## Mengapa Menggunakan Pattern-Pattern Ini?

### 1. **Module Pattern (NestJS Modules)**

**Implementasi:**

- `UsersModule`, `NotesModule`, `DatabaseModule`
- Setiap module punya `providers`, `controllers`, `imports`, `exports`

**Alasan:**

- ✅ **Separation of Concerns** - Setiap module handle domain spesifik
- ✅ **Maintainability** - Mudah maintain, scale, dan modify per module
- ✅ **Testability** - Module bisa di-test secara isolated
- ✅ **Reusability** - Module bisa di-reuse di project lain
- ✅ **Team Collaboration** - Developer bisa kerja parallel di module berbeda

**Contoh:**

```typescript
@Module({
  imports: [SequelizeModule.forFeature([Note])],
  providers: [NotesService, AuthGuard],
  controllers: [NotesController],
  exports: [NotesService],
})
export class NotesModule {}
```

---

### 2. **MVC Pattern (Controller-Service-Model)**

**Implementasi:**

- **Controller** - `notes.controller.ts` (handle HTTP requests)
- **Service** - `notes.service.ts` (business logic)
- **Model** - `note.model.ts` (data structure)

**Alasan:**

- ✅ **Single Responsibility** - Setiap layer punya tanggung jawab jelas
- ✅ **Code Organization** - Struktur code terorganisir dan predictable
- ✅ **Easier Testing** - Service logic bisa di-test tanpa HTTP layer
- ✅ **Flexibility** - Ganti database/UI tanpa ubah business logic
- ✅ **Industry Standard** - Pattern yang umum digunakan, mudah dipahami developer baru

**Flow:**

```
Request → Controller → Service → Model → Database
Response ← Controller ← Service ← Model ← Database
```

---

### 3. **Dependency Injection (DI)**

**Implementasi:**

```typescript
constructor(private readonly notesService: NotesService) {}
```

**Alasan:**

- ✅ **Loose Coupling** - Class tidak hardcode dependencies
- ✅ **Testability** - Mudah inject mock dependencies untuk testing
- ✅ **Flexibility** - Mudah swap implementation tanpa ubah code
- ✅ **Lifecycle Management** - NestJS handle object creation & destruction
- ✅ **Singleton Pattern** - Services di-share across modules (efficient memory)

---

### 4. **Guard Pattern (Authentication Guard)**

**Implementasi:**

- `AuthGuard` di `notes/guards/auth.guard.ts`
- Applied dengan `@UseGuards(AuthGuard)`

**Alasan:**

- ✅ **Reusable Security** - 1 guard bisa protect multiple endpoints
- ✅ **Separation of Concerns** - Auth logic terpisah dari business logic
- ✅ **Declarative Security** - Tinggal tambah decorator, bukan if-else di controller
- ✅ **Centralized Auth** - Ubah auth logic di 1 tempat, semua endpoint ter-update
- ✅ **Clean Controller** - Controller fokus ke business logic, bukan auth

**Contoh:**

```typescript
@UseGuards(AuthGuard) // ← Semua method di-protect
@Controller('notes')
export class NotesController {}
```

---

### 5. **Repository Pattern (ORM - Sequelize)**

**Implementasi:**

- Sequelize models dengan `@InjectModel(Note)`
- Service layer sebagai abstraction

**Alasan:**

- ✅ **Database Abstraction** - Ganti database tanpa ubah business logic
- ✅ **Query Centralization** - Semua database query di service layer
- ✅ **Type Safety** - TypeScript + Sequelize provide type checking
- ✅ **Migrations** - Database schema versioning & rollback support
- ✅ **Easier Testing** - Mock repository untuk unit tests

---

### 6. **JWT Token Authentication**

**Implementasi:**

- Login return `accessToken`
- Guard verify token & extract `userId`
- Token di-inject ke request: `req.userId`

**Alasan:**

- ✅ **Stateless** - Server tidak perlu store session (scalable)
- ✅ **Secure** - Token signed dengan secret, tidak bisa di-forge
- ✅ **Portable** - Token bisa digunakan di multiple services (microservices ready)
- ✅ **User Context** - Payload contains user info, no DB query per request
- ✅ **Standard** - Industry standard untuk REST API authentication

**Flow:**

```
1. User login → Server return JWT token
2. Client store token
3. Request dengan header: Authorization: Bearer <token>
4. Guard verify & decode token
5. Extract userId → inject ke req.userId
6. Controller akses req.userId untuk ownership validation
```

---

### 7. **Ownership Validation Pattern**

**Implementasi:**

```typescript
if (existingNote.userId !== req.userId) {
  throw new ForbiddenException('You can only update your own notes');
}
```

**Alasan:**

- ✅ **Security** - User tidak bisa manipulasi data user lain
- ✅ **Data Integrity** - Protect data dari unauthorized access
- ✅ **Authorization** - Bukan hanya authentication, tapi juga authorization
- ✅ **User Privacy** - Setiap user cuma bisa akses data miliknya
- ✅ **REST Best Practice** - Resource protection by owner

---

### 8. **Migration-Based Database**

**Implementasi:**

- Sequelize CLI migrations di `database/migrations/`
- `synchronize: false` di database config

**Alasan:**

- ✅ **Version Control** - Database schema tracked di git
- ✅ **Team Collaboration** - Developer apply migration yang sama
- ✅ **Rollback Support** - Bisa rollback schema changes
- ✅ **Production Safety** - Tidak auto-sync (prevent data loss)
- ✅ **Audit Trail** - History of all schema changes
- ✅ **CI/CD Ready** - Automate migrations di deployment pipeline

**Commands:**

```bash
npm run migration:generate -- --name create-users-table
npm run migration:run
npm run migration:revert
```

---

### 9. **Environment Configuration Pattern**

**Implementasi:**

- `.env` file untuk sensitive data
- `config/config.ts` untuk centralized config
- `ConfigModule.forRoot()` untuk global access

**Alasan:**

- ✅ **Security** - Sensitive data (DB password, JWT secret) tidak di-commit
- ✅ **Environment-Specific** - Beda config untuk dev/staging/production
- ✅ **Flexibility** - Ubah config tanpa rebuild code
- ✅ **12-Factor App** - Following industry best practices
- ✅ **Type Safety** - ConfigService provide typed access

---

### 10. **Error Handling Pattern**

**Implementasi:**

- `UnauthorizedException`, `ForbiddenException`
- NestJS built-in exception filters

**Alasan:**

- ✅ **Consistent Response** - Semua error punya format sama
- ✅ **HTTP Compliance** - Proper HTTP status codes
- ✅ **Client-Friendly** - Error messages jelas & actionable
- ✅ **Security** - Tidak expose internal implementation details
- ✅ **Debugging** - Easy to track & log errors

---

## Summary: Kenapa Pattern-Pattern Ini?

| Pattern              | Benefit Utama                |
| -------------------- | ---------------------------- |
| Module Pattern       | Scalability & Organization   |
| MVC                  | Separation of Concerns       |
| Dependency Injection | Testability & Loose Coupling |
| Guard Pattern        | Reusable Security            |
| Repository Pattern   | Database Abstraction         |
| JWT Auth             | Stateless & Scalable         |
| Ownership Validation | Security & Privacy           |
| Migrations           | Safe Schema Changes          |
| Config Pattern       | Environment Flexibility      |
| Error Handling       | Consistent UX                |

**Result:** Code yang **maintainable**, **scalable**, **secure**, dan **testable** untuk production-ready REST API.

---

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
