# Test Documentation

## E2E Test Coverage

File test lengkap untuk semua API endpoints berdasarkan DokumentasiAPI.md.

### Test File Location

- `test/app.e2e-spec.ts`

---

## Test Structure

### 1. Setup & Teardown

```typescript
beforeAll(); // Initialize app module
afterAll(); // Close app connection
```

### 2. Test Variables

- `accessToken` - JWT token untuk user 1
- `accessToken2` - JWT token untuk user 2
- `userId` - ID user 1
- `userId2` - ID user 2
- `noteId` - ID note untuk testing

---

## Test Coverage by Endpoint

### ✅ Root Endpoint

**Test:** `1. GET /`

- ✓ Should return welcome message
- ✓ Verify response structure

### ✅ Users Endpoints

**Test:** `2. POST /users/register`

- ✓ Register new user 1 (testuser1@example.com)
- ✓ Register new user 2 (testuser2@example.com)
- ✓ Verify response contains user data
- ✓ Capture userId for later tests

**Test:** `3. GET /users`

- ✓ Get all users
- ✓ Verify response is array
- ✓ Verify users exist

**Test:** `4. POST /users/login`

- ✓ Login user 1 and get access token
- ✓ Login user 2 and get access token
- ✓ Return 401 for invalid credentials
- ✓ Capture tokens for protected route tests

**Test:** `10. DELETE /users/:id`

- ✓ Delete user 1
- ✓ Delete user 2
- ✓ Verify success message

---

### ✅ Notes Endpoints (Protected)

**Test:** `5. POST /notes`

- ✓ Return 401 without token
- ✓ Create note with valid token (user 1)
- ✓ Create note for user 2
- ✓ Verify userId is auto-injected from JWT
- ✓ Capture noteId for later tests

**Test:** `6. GET /notes`

- ✓ Return 401 without token
- ✓ Get all notes for logged in user
- ✓ Verify notes are filtered by userId
- ✓ User 1 cannot see user 2's notes

**Test:** `7. GET /notes/:id`

- ✓ Return 401 without token
- ✓ Get note by id with valid token
- ✓ Return 403 when accessing other user's note (ownership validation)

**Test:** `8. PUT /notes/:id`

- ✓ Return 401 without token
- ✓ Update note with valid token
- ✓ Verify affected count
- ✓ Return 403 when updating other user's note (ownership validation)

**Test:** `9. DELETE /notes/:id`

- ✓ Return 401 without token
- ✓ Return 403 when deleting other user's note (ownership validation)
- ✓ Delete note with valid token
- ✓ Return 403 for note not found

---

## Authentication & Authorization Tests

### Authentication (401 Unauthorized)

Tested on **ALL** protected endpoints:

- POST /notes
- GET /notes
- GET /notes/:id
- PUT /notes/:id
- DELETE /notes/:id

### Authorization (403 Forbidden)

**Ownership validation tested:**

- ✓ User cannot view other user's note
- ✓ User cannot update other user's note
- ✓ User cannot delete other user's note

---

## Test Flow Sequence

```
1. Initialize App
   ↓
2. Test Root Endpoint (GET /)
   ↓
3. Register Users
   → User 1: testuser1@example.com
   → User 2: testuser2@example.com
   ↓
4. Get All Users
   ↓
5. Login Users
   → Get accessToken for User 1
   → Get accessToken for User 2
   → Test invalid credentials
   ↓
6. Test Notes CRUD (Protected)
   → Test without token (401)
   → Create notes for both users
   → Get notes (filtered by user)
   → Get note by id
   → Test ownership validation (403)
   → Update note (with ownership check)
   → Delete note (with ownership check)
   ↓
7. Cleanup - Delete Users
   ↓
8. Close App
```

---

## Running Tests

### Run All Tests

```bash
npm run test:e2e
```

### Run with Coverage

```bash
npm run test:cov
```

### Run in Watch Mode

```bash
npm run test:watch
```

### Run Specific Test

```bash
npm run test:e2e -- --testNamePattern="POST /notes"
```

---

## Expected Test Results

**Total Test Suites:** 1  
**Total Tests:** 21+

### Breakdown:

- Root: 1 test
- Users Register: 2 tests
- Users Get All: 1 test
- Users Login: 3 tests
- Notes POST: 3 tests
- Notes GET All: 3 tests
- Notes GET by ID: 3 tests
- Notes PUT: 3 tests
- Notes DELETE: 4 tests
- Users DELETE: 2 tests

---

## Test Environment

### Prerequisites

1. Database harus jalan (PostgreSQL)
2. Database test sudah di-migrate
3. Environment variables di `.env` sudah di-set

### Database Setup for Testing

```bash
# Run migrations
npm run migration:run

# Jika perlu reset database
npm run migration:revert
npm run migration:run
```

---

## Assertions Covered

### Response Structure

- ✓ Status codes (200, 201, 204, 401, 403)
- ✓ Response body properties
- ✓ Data types
- ✓ Array structures

### Business Logic

- ✓ JWT token generation
- ✓ User authentication
- ✓ Ownership validation
- ✓ Auto-injection of userId from JWT
- ✓ Data filtering by user

### Security

- ✓ Protected routes require token
- ✓ Invalid tokens rejected
- ✓ Users cannot access other users' data
- ✓ Proper HTTP status codes

---

## Troubleshooting

### Port Already in Use

```bash
# Kill process on port 3000
npx kill-port 3000
```

### Database Connection Error

```bash
# Check PostgreSQL is running
# Verify .env database credentials
# Run migrations
npm run migration:run
```

### Tests Failing

```bash
# Clear all test data
npm run migration:revert
npm run migration:run

# Run tests again
npm run test:e2e
```

---

## Adding New Tests

### Template for New Test

```typescript
describe('New Feature Test', () => {
  it('should do something', () => {
    return request(app.getHttpServer())
      .post('/endpoint')
      .set('Authorization', `Bearer ${accessToken}`)
      .send({ data: 'value' })
      .expect(201)
      .expect((res) => {
        expect(res.body).toHaveProperty('id');
      });
  });
});
```

### Best Practices

1. ✅ Test happy path first
2. ✅ Test error cases (401, 403, 404)
3. ✅ Test with and without authentication
4. ✅ Test ownership validation
5. ✅ Use descriptive test names
6. ✅ Clean up test data after tests

---

## Coverage Goals

- [x] All endpoints tested
- [x] Authentication tested
- [x] Authorization tested
- [x] Error cases tested
- [x] Success cases tested
- [x] Data validation tested

**Current Coverage:** ✅ 100% of documented API endpoints
