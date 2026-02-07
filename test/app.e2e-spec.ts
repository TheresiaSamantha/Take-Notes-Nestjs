/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-argument */

import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import request from 'supertest';
import { AppModule } from './../src/app.module';

describe('Take Note API (e2e)', () => {
  let app: INestApplication;
  let accessToken: string;
  let accessToken2: string;
  let userId: number;
  let userId2: number;
  let noteId: number;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  afterAll(async () => {
    await app.close();
  });

  // ==================== ROOT ENDPOINT ====================
  describe('1. GET /', () => {
    it('should return welcome message', () => {
      return request(app.getHttpServer())
        .get('/')
        .expect(200)
        .expect((res) => {
          expect(res.body).toHaveProperty('message');
          expect(res.body.message).toContain('Welcome to Take Note API');
        });
    });
  });

  // ==================== USERS ENDPOINTS ====================
  describe('2. POST /users/register', () => {
    it('should register new user 1', () => {
      return request(app.getHttpServer())
        .post('/users/register')
        .send({
          name: 'Test User 1',
          email: 'testuser1@example.com',
          password: 'password123',
        })
        .expect(201)
        .expect((res) => {
          expect(res.body).toHaveProperty('message');
          expect(res.body).toHaveProperty('data');
          expect(res.body.data).toHaveProperty('id');
          expect(res.body.data.name).toBe('Test User 1');
          expect(res.body.data.email).toBe('testuser1@example.com');
          userId = res.body.data.id;
        });
    });

    it('should register new user 2', () => {
      return request(app.getHttpServer())
        .post('/users/register')
        .send({
          name: 'Test User 2',
          email: 'testuser2@example.com',
          password: 'password456',
        })
        .expect(201)
        .expect((res) => {
          expect(res.body.data).toHaveProperty('id');
          userId2 = res.body.data.id;
        });
    });
  });

  describe('3. GET /users', () => {
    it('should get all users', () => {
      return request(app.getHttpServer())
        .get('/users')
        .expect(200)
        .expect((res) => {
          expect(res.body).toHaveProperty('message');
          expect(res.body).toHaveProperty('data');
          expect(Array.isArray(res.body.data)).toBe(true);
          expect(res.body.data.length).toBeGreaterThan(0);
        });
    });
  });

  describe('4. POST /users/login', () => {
    it('should login user 1 and return access token', () => {
      return request(app.getHttpServer())
        .post('/users/login')
        .send({
          email: 'testuser1@example.com',
          password: 'password123',
        })
        .expect(201)
        .expect((res) => {
          expect(res.body).toHaveProperty('accessToken');
          expect(typeof res.body.accessToken).toBe('string');
          accessToken = res.body.accessToken;
        });
    });

    it('should login user 2 and return access token', () => {
      return request(app.getHttpServer())
        .post('/users/login')
        .send({
          email: 'testuser2@example.com',
          password: 'password456',
        })
        .expect(201)
        .expect((res) => {
          expect(res.body).toHaveProperty('accessToken');
          accessToken2 = res.body.accessToken;
        });
    });

    it('should return 401 for invalid credentials', () => {
      return request(app.getHttpServer())
        .post('/users/login')
        .send({
          email: 'testuser1@example.com',
          password: 'wrongpassword',
        })
        .expect(401)
        .expect((res) => {
          expect(res.body).toHaveProperty('message');
          expect(res.body.statusCode).toBe(401);
        });
    });
  });

  // ==================== NOTES ENDPOINTS (PROTECTED) ====================
  describe('5. POST /notes (Protected)', () => {
    it('should return 401 without token', () => {
      return request(app.getHttpServer())
        .post('/notes')
        .send({
          title: 'Test Note',
          content: 'Test Content',
        })
        .expect(401);
    });

    it('should create note with valid token', () => {
      return request(app.getHttpServer())
        .post('/notes')
        .set('Authorization', `Bearer ${accessToken}`)
        .send({
          title: 'My First Note',
          content: 'This is test content',
        })
        .expect(201)
        .expect((res) => {
          expect(res.body).toHaveProperty('id');
          expect(res.body.title).toBe('My First Note');
          expect(res.body.content).toBe('This is test content');
          expect(res.body).toHaveProperty('userId');
          noteId = res.body.id;
        });
    });

    it('should create note for user 2', () => {
      return request(app.getHttpServer())
        .post('/notes')
        .set('Authorization', `Bearer ${accessToken2}`)
        .send({
          title: 'User 2 Note',
          content: 'Content from user 2',
        })
        .expect(201);
    });
  });

  describe('6. GET /notes (Protected)', () => {
    it('should return 401 without token', () => {
      return request(app.getHttpServer()).get('/notes').expect(401);
    });

    it('should get all notes for logged in user', () => {
      return request(app.getHttpServer())
        .get('/notes')
        .set('Authorization', `Bearer ${accessToken}`)
        .expect(200)
        .expect((res) => {
          expect(Array.isArray(res.body)).toBe(true);
          expect(res.body.length).toBeGreaterThan(0);
          // Should only return notes for current user
          res.body.forEach((note: any) => {
            expect(note).toHaveProperty('id');
            expect(note).toHaveProperty('title');
            expect(note).toHaveProperty('userId');
          });
        });
    });

    it('should only return notes owned by user 1', () => {
      return request(app.getHttpServer())
        .get('/notes')
        .set('Authorization', `Bearer ${accessToken}`)
        .expect(200)
        .expect((res) => {
          // User 1 should only see their own notes
          const hasUser2Note = res.body.some(
            (note: any) => note.title === 'User 2 Note',
          );
          expect(hasUser2Note).toBe(false);
        });
    });
  });

  describe('7. GET /notes/:id (Protected)', () => {
    it('should return 401 without token', () => {
      return request(app.getHttpServer()).get(`/notes/${noteId}`).expect(401);
    });

    it('should get note by id with valid token', () => {
      return request(app.getHttpServer())
        .get(`/notes/${noteId}`)
        .set('Authorization', `Bearer ${accessToken}`)
        .expect(200)
        .expect((res) => {
          expect(res.body).toHaveProperty('id');
          expect(res.body.id).toBe(noteId);
          expect(res.body).toHaveProperty('title');
          expect(res.body).toHaveProperty('content');
        });
    });

    it('should return 403 when trying to access other user note', async () => {
      // User 2 tries to access User 1's note
      return request(app.getHttpServer())
        .get(`/notes/${noteId}`)
        .set('Authorization', `Bearer ${accessToken2}`)
        .expect(403)
        .expect((res) => {
          expect(res.body.message).toContain('your own notes');
        });
    });
  });

  describe('8. PUT /notes/:id (Protected)', () => {
    it('should return 401 without token', () => {
      return request(app.getHttpServer())
        .put(`/notes/${noteId}`)
        .send({
          title: 'Updated Title',
        })
        .expect(401);
    });

    it('should update note with valid token', () => {
      return request(app.getHttpServer())
        .put(`/notes/${noteId}`)
        .set('Authorization', `Bearer ${accessToken}`)
        .send({
          title: 'Updated Note Title',
          content: 'Updated content',
        })
        .expect(200)
        .expect((res) => {
          expect(res.body).toHaveProperty('affected');
          expect(res.body).toHaveProperty('data');
          expect(res.body.affected).toBeGreaterThan(0);
        });
    });

    it('should return 403 when trying to update other user note', () => {
      // User 2 tries to update User 1's note
      return request(app.getHttpServer())
        .put(`/notes/${noteId}`)
        .set('Authorization', `Bearer ${accessToken2}`)
        .send({
          title: 'Hacked Title',
        })
        .expect(403)
        .expect((res) => {
          expect(res.body.message).toContain('your own notes');
        });
    });
  });

  describe('9. DELETE /notes/:id (Protected)', () => {
    it('should return 401 without token', () => {
      return request(app.getHttpServer())
        .delete(`/notes/${noteId}`)
        .expect(401);
    });

    it('should return 403 when trying to delete other user note', () => {
      // User 2 tries to delete User 1's note
      return request(app.getHttpServer())
        .delete(`/notes/${noteId}`)
        .set('Authorization', `Bearer ${accessToken2}`)
        .expect(403)
        .expect((res) => {
          expect(res.body.message).toContain('your own notes');
        });
    });

    it('should delete note with valid token', () => {
      return request(app.getHttpServer())
        .delete(`/notes/${noteId}`)
        .set('Authorization', `Bearer ${accessToken}`)
        .expect(204);
    });

    it('should return 403 for note not found', () => {
      return request(app.getHttpServer())
        .delete(`/notes/${noteId}`)
        .set('Authorization', `Bearer ${accessToken}`)
        .expect(403);
    });
  });

  // ==================== CLEANUP ====================
  describe('10. DELETE /users/:id', () => {
    it('should delete user 1', () => {
      return request(app.getHttpServer())
        .delete(`/users/${userId}`)
        .expect(200)
        .expect((res) => {
          expect(res.body).toHaveProperty('message');
          expect(res.body.message).toContain('berhasil dihapus');
        });
    });

    it('should delete user 2', () => {
      return request(app.getHttpServer())
        .delete(`/users/${userId2}`)
        .expect(200);
    });
  });
});
